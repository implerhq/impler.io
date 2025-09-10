import axios from 'axios';
import * as sax from 'sax';

enum StageEnum {
  FETCHING = 'fetching',
  PARSING = 'parsing',
  EXTRACTING = 'extracting',
  MAPPING = 'mapping',
  COMPLETED = 'completed',
  ERROR = 'error',
}
export interface IProgressData {
  sessionId: string;
  percentage: number;
  stage: StageEnum;
  message?: string;
  error?: string;
}

export interface IParseXMLAndExtractData {
  xmlUrl: string;
  sessionId?: string;
  sendProgress?: (sessionId: string, progressData: IProgressData) => void;
  sendError?: (sessionId: string, error: string) => void;
  sendCompletion?: (sessionId: string, result: any) => void;
  abortSignal?: AbortSignal;
}

interface IParsedElement {
  [key: string]: any;
}

interface IPathMapping {
  key: string;
  path: string;
}

interface IBatchExtractionResult {
  [key: string]: any[];
}

export class RSSXMLService {
  private xmlUrl: string;
  private totalItemsProcessed = 0;
  private lastProgressTime = 0;
  private bytesProcessed = 0;
  private totalBytes = 0;
  private sessionId?: string;
  private sendProgress?: (sessionId: string, progressData: IProgressData) => void;
  private sendError?: (sessionId: string, error: string) => void;
  private sendCompletion?: (sessionId: string, result: any) => void;
  private abortSignal?: AbortSignal;
  private responseStream?: any;
  private isAborted = false;

  constructor(xmlUrl?: string) {
    this.xmlUrl = xmlUrl;
  }

  // Enhanced abort signal checking with proper error handling
  private checkAbortSignal(): void {
    if (this.abortSignal?.aborted || this.isAborted) {
      this.isAborted = true;
      // Clean up resources before throwing
      this.cleanup();

      const error = new Error('Request aborted');
      error.name = 'AbortError';
      throw error;
    }
  }

  // Cleanup method to properly dispose of resources
  private cleanup(): void {
    try {
      // Destroy response stream if it exists
      if (this.responseStream && typeof this.responseStream.destroy === 'function') {
        this.responseStream.destroy();
      }
    } catch (error) {}
  }

  private sendProgressToClient(): void {
    // Check abort signal frequently during processing
    this.checkAbortSignal();

    const now = Date.now();

    // Only update every 1 second
    if (now - this.lastProgressTime > 1000) {
      const percentage = this.totalBytes > 0 ? ((this.bytesProcessed / this.totalBytes) * 100).toFixed(1) : '0.0';
      if (this.sessionId && this.sendProgress) {
        this.sendProgress(this.sessionId, {
          sessionId: this.sessionId,
          percentage: parseFloat(percentage),
          stage: StageEnum.PARSING,
        });
      }

      this.lastProgressTime = now;
    }
  }

  async getBatchXMLKeyValuesByPaths(
    obj: Record<string, any>,
    pathMappings: IPathMapping[]
  ): Promise<IBatchExtractionResult> {
    const result: IBatchExtractionResult = {};

    // Initialize result arrays for each mapping
    pathMappings.forEach((mapping) => {
      result[mapping.key] = [];
    });

    // Parse paths and prepare for extraction
    const parsedPaths = pathMappings.map((mapping) => ({
      key: mapping.key,
      pathArray: mapping.path?.split('>').map((key) => key.trim()) || [],
      originalPath: mapping.path,
    }));

    // Single traversal to extract all values
    this.extractMultiplePathsRecursive(obj, parsedPaths, result, []);

    return result;
  }

  private extractMultiplePathsRecursive(
    current: any,
    pathMappings: Array<{ key: string; pathArray: string[]; originalPath: string }>,
    result: IBatchExtractionResult,
    currentPath: string[]
  ): void {
    // Check abort signal during recursive operations
    this.checkAbortSignal();

    // Check if current path matches any of our target paths
    pathMappings.forEach((mapping) => {
      if (this.isPathMatches(currentPath, mapping.pathArray)) {
        const value = this.extractValue(current);
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            result[mapping.key].push(...value);
          } else {
            result[mapping.key].push(value);
          }
        }
      }
    });

    // Continue traversing if current is an object
    if (current && typeof current === 'object') {
      if (Array.isArray(current)) {
        // For arrays, we need to traverse each item
        current.forEach((item) => {
          this.extractMultiplePathsRecursive(item, pathMappings, result, currentPath);
        });
      } else {
        Object.keys(current).forEach((key) => {
          // Skip metadata keys but still traverse them for completeness
          const nextPath = [...currentPath, key];
          this.extractMultiplePathsRecursive(current[key], pathMappings, result, nextPath);
        });
      }
    }
  }

  private isPathMatches(currentPath: string[], targetPath: string[]): boolean {
    if (currentPath.length !== targetPath.length) {
      return false;
    }

    for (let i = 0; i < currentPath.length; i++) {
      const current = currentPath[i];
      const target = targetPath[i];

      // Handle array notation - if target has [], current path should match the base name
      if (target.endsWith('[]')) {
        const targetKey = target.slice(0, -2);
        if (current !== targetKey) {
          return false;
        }
      } else if (current !== target) {
        return false;
      }
    }

    return true;
  }

  private extractValue(value: any): any {
    if (value === null || value === undefined) {
      return undefined;
    }

    // Handle objects with $ (attributes) and _ (text content)
    if (typeof value === 'object' && !Array.isArray(value)) {
      // If it has text content (_), return that
      if (value._ !== undefined) {
        return value._;
      }

      // If it only has attributes ($) and no content, return undefined
      if (value.$ !== undefined && Object.keys(value).length === 1) {
        return undefined;
      }

      // If it's a complex object, try to extract meaningful content
      const keys = Object.keys(value).filter((key) => key !== '$');
      if (keys.length === 1 && typeof value[keys[0]] === 'string') {
        return value[keys[0]];
      }
    }

    // Return primitive values
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      const extracted = value
        .map((item) => this.extractValue(item))
        .filter((val) => val !== undefined && val !== null && val !== '');

      return extracted.length > 0 ? extracted : undefined;
    }

    return undefined;
  }

  async mappingFunction(mappingsData: IPathMapping[], batchResult: IBatchExtractionResult): Promise<any[]> {
    const result = [];
    const keys = mappingsData.map((mapping) => mapping.key);

    // Find the maximum length across all extracted arrays
    const maxLength = Math.max(...keys.map((key) => batchResult[key]?.length || 0), 0);

    // If no data found, return empty array
    if (maxLength === 0) {
      return [];
    }

    for (let i = 0; i < maxLength; i++) {
      // Check abort signal during mapping
      this.checkAbortSignal();

      const item: any = {};
      keys.forEach((key) => {
        const values = batchResult[key];
        item[key] = values && values.length > i ? values[i] : undefined;
      });
      result.push(item);
    }

    return result;
  }

  async parseXMLAndExtractData(data: IParseXMLAndExtractData) {
    this.xmlUrl = data.xmlUrl;
    this.sessionId = data.sessionId;
    this.sendProgress = data.sendProgress;
    this.sendError = data.sendError;
    this.sendCompletion = data.sendCompletion;
    this.abortSignal = data.abortSignal;
    this.isAborted = false;

    try {
      if (this.abortSignal) {
        this.abortSignal.addEventListener('abort', () => {
          return;
        });
      }

      // Parse the XML
      const xmlData = await this.parseXML();

      // Check if aborted after parsing
      this.checkAbortSignal();

      // Extract keys
      const keys = await this.printKeys(xmlData);

      // Check if aborted after key extraction
      this.checkAbortSignal();

      if (keys.length > 0 && xmlData) {
        this.sendCompletion?.(data.sessionId, { keys });
      }

      return {
        keys,
        xmlData,
      };
    } catch (error) {
      // Don't send error if it was aborted by user
      if (!this.isAborted && error.name !== 'AbortError') {
        this.sendError?.(data.sessionId, error.message || 'Unknown error occurred');
      }

      // Clean up resources
      this.cleanup();

      return null;
    }
  }

  // Keep existing methods for backward compatibility
  extractKeys(obj: any, prefix = '', result: Set<string> = new Set()): string[] {
    if (Array.isArray(obj)) {
      obj.forEach((item) => {
        const newPrefix = `${prefix}[]`;
        this.extractKeys(item, newPrefix, result);
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach((key) => {
        const newPrefix = prefix ? `${prefix} > ${key}` : key;
        result.add(newPrefix);
        this.extractKeys(obj[key], newPrefix, result);
      });
    }

    return Array.from(result);
  }

  async printKeys(obj: Record<string, any>, prefix = '', result: Set<string> = new Set()): Promise<string[]> {
    this.checkAbortSignal();

    if (Array.isArray(obj)) {
      obj.forEach((item) => {
        const newPrefix = `${prefix}[]`;
        this.printKeys(item, newPrefix, result);
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach((key) => {
        const newPrefix = prefix ? `${prefix} > ${key}` : key;
        result.add(newPrefix);
        this.printKeys(obj[key], newPrefix, result);
      });
    }

    return Array.from(result);
  }

  async parseXML(): Promise<IParsedElement | null> {
    try {
      return new Promise(async (resolve, reject) => {
        // Check abort signal before starting
        this.checkAbortSignal();

        const response = await this.fetchStream(this.xmlUrl);
        this.responseStream = response;

        const parser = sax.createStream(true, {
          lowercase: true,
          trim: true,
          normalize: true,
        });

        const xmlStructure: IParsedElement = {};
        const elementStack: Array<{
          path: string[];
          text: string;
          attributes?: any;
        }> = [];
        let currentPath: string[] = [];
        let currentText = '';
        let currentAttributes: any = null;

        // Set up abort signal listener on the response stream
        if (this.abortSignal) {
          this.abortSignal.addEventListener('abort', () => {
            this.isAborted = true;
            if (response && typeof response.destroy === 'function') {
              response.destroy();
            }
          });
        }

        response.on('data', (chunk: Buffer) => {
          this.bytesProcessed += chunk.length;

          try {
            this.sendProgressToClient();
          } catch (error) {
            if (error.name === 'AbortError') {
              response.destroy();

              return;
            }
            throw error;
          }
        });

        parser.on('opentag', (node) => {
          if (this.isAborted || this.abortSignal?.aborted) {
            parser.destroy();

            return;
          }

          this.totalItemsProcessed++;

          elementStack.push({
            path: [...currentPath],
            text: currentText,
            attributes: currentAttributes,
          });

          currentPath.push(node.name);
          currentText = '';
          currentAttributes = node.attributes && Object.keys(node.attributes).length > 0 ? node.attributes : null;
        });

        parser.on('text', (text: string) => {
          if (this.isAborted || this.abortSignal?.aborted) {
            parser.destroy();

            return;
          }

          if (text.trim()) {
            currentText += text.trim();
          }
        });

        parser.on('cdata', (cdata: string) => {
          if (cdata.trim()) {
            currentText += cdata.trim();
          }
        });

        parser.on('closetag', () => {
          const stackItem = elementStack.pop();
          if (!stackItem) return;

          if (currentPath.length > 0) {
            this.setValue(xmlStructure, currentPath, currentText, currentAttributes);
          }

          currentPath = stackItem.path;
          currentText = stackItem.text;
          currentAttributes = stackItem.attributes;
        });

        parser.on('end', async () => {
          if (this.isAborted) {
            reject(new Error('Request aborted'));

            return;
          }

          try {
            resolve(xmlStructure);
          } catch (error) {
            if (error.name === 'AbortError') {
              reject(error);
            } else {
              throw error;
            }
          }
        });

        parser.on('error', (err) => {
          if (!this.isAborted) {
            reject(err);
          }
        });

        response.on('error', (err: any) => {
          if (!this.isAborted) {
            reject(err);
          }
        });

        // Handle stream abort
        response.on('aborted', () => {
          reject(new Error('Request aborted'));
        });

        try {
          response.pipe(parser);
        } catch (error) {
          if (!this.isAborted) {
            reject(error);
          }
        }
      });
    } catch (err) {
      this.cleanup();

      if (err.name === 'AbortError' || this.isAborted) {
        throw err;
      }

      return null;
    }
  }

  async setValue(obj: Record<string, any>, path: string[], value: any, attributes?: any): Promise<void> {
    // Validate path to prevent prototype pollution
    const forbiddenKeys = ['__proto__', 'constructor', 'prototype'];
    if (path.some((key) => forbiddenKeys.includes(key))) {
      throw new Error('Invalid path: contains forbidden keys');
    }

    let current = obj;

    // Navigate to parent
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key];
    }

    const finalKey = path[path.length - 1];

    // Skip empty values unless they have attributes
    const hasValue = value && value.trim() !== '';
    const hasAttributes = attributes && Object.keys(attributes).length > 0;

    if (!hasValue && !hasAttributes) {
      return;
    }

    // Create element with value and/or attributes
    let element: any;
    if (hasAttributes) {
      element = { $: attributes };
      if (hasValue) {
        element._ = value;
      }
    } else {
      element = value;
    }

    // Handle duplicate keys by creating arrays
    if (finalKey in current) {
      // Convert to array if not already
      if (!Array.isArray(current[finalKey])) {
        current[finalKey] = [current[finalKey]];
      }
      current[finalKey].push(element);
    } else {
      // First occurrence
      current[finalKey] = element;
    }
  }

  // Enhanced fetchStream method with proper abort handling
  async fetchStream(url: string): Promise<any> {
    // Check if already aborted before starting
    this.checkAbortSignal();

    try {
      // Create a new AbortController for the axios request if we don't have one
      const controller = new AbortController();

      // If we have an existing abort signal, listen to it
      if (this.abortSignal) {
        this.abortSignal.addEventListener('abort', () => {
          controller.abort();
        });
      }

      const response = await axios.get(url, {
        responseType: 'stream',
        timeout: 30000,
        signal: controller.signal, // Use the controller's signal
        headers: {
          'User-Agent': 'Mozilla/5.0 (Node.js XML Parser)',
          Accept: 'application/rss+xml, application/xml, text/xml, */*',
        },
      });

      const contentLength = response.headers['content-length'];
      if (contentLength) {
        this.totalBytes = parseInt(contentLength);
      }

      return response.data;
    } catch (error) {
      if (error.name === 'AbortError' || error.code === 'ABORT_ERR' || error.message?.includes('aborted')) {
        const abortError = new Error('Request aborted');
        abortError.name = 'AbortError';
        throw abortError;
      }
      throw error;
    }
  }
}
