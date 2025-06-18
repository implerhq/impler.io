import axios from 'axios';
import * as sax from 'sax';

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
  private startTime = 0;
  private lastBytesProcessed = 0;
  private lastSpeedCheckTime = 0;
  private currentSpeedMBps = 0;

  constructor(xmlUrl?: string) {
    this.xmlUrl = xmlUrl;
  }

  private showProgress(): void {
    const now = Date.now();
    const elapsed = (now - this.startTime) / 1000; // in seconds

    // Only update every 1 second
    if (now - this.lastProgressTime > 1000) {
      const percentage = this.totalBytes > 0 ? ((this.bytesProcessed / this.totalBytes) * 100).toFixed(1) : '0.0';
      const processedFormatted = this.formatBytes(this.bytesProcessed);
      const totalFormatted = this.totalBytes > 0 ? this.formatBytes(this.totalBytes) : 'Unknown';

      // Calculate speed (MB/sec)
      const bytesDelta = this.bytesProcessed - this.lastBytesProcessed;
      const timeDelta = (now - this.lastSpeedCheckTime) / 1000;
      if (timeDelta > 0) {
        this.currentSpeedMBps = bytesDelta / (1024 * 1024) / timeDelta;
      }

      this.lastBytesProcessed = this.bytesProcessed;
      this.lastSpeedCheckTime = now;

      // Calculate ETA
      let etaString = 'Unknown';
      if (this.totalBytes > 0 && this.currentSpeedMBps > 0) {
        const remainingMB = (this.totalBytes - this.bytesProcessed) / (1024 * 1024);
        const etaSeconds = remainingMB / this.currentSpeedMBps;
        const mins = Math.floor(etaSeconds / 60);
        const secs = Math.floor(etaSeconds % 60);
        etaString = `${mins}m ${secs}s`;
      }

      console.log(
        `📊 Progress: ${percentage}% | Processed: ${processedFormatted}/${totalFormatted}` +
          ` | Elements: ${this.totalItemsProcessed}` +
          ` | Speed: ${this.formatBytesPerSecond(this.currentSpeedMBps * 1024 * 1024)}` +
          ` | ETA: ~${etaString}`
      );

      this.lastProgressTime = now;
    }
  }

  private formatBytesPerSecond(bytesPerSec: number): string {
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
    const i = Math.floor(Math.log(bytesPerSec) / Math.log(k));
    const value = bytesPerSec / Math.pow(k, i);

    return `${value.toFixed(2)} ${sizes[i]}`;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // NEW: Batch extraction method that traverses the XML structure only once
  async getBatchXMLKeyValuesByPaths(
    obj: Record<string, any>,
    pathMappings: IPathMapping[]
  ): Promise<IBatchExtractionResult> {
    console.log('🚀 Starting batch extraction for', pathMappings.length, 'paths');
    const startTime = Date.now();

    const result: IBatchExtractionResult = {};

    // Initialize result arrays for each mapping
    pathMappings.forEach((mapping) => {
      result[mapping.key] = [];
    });

    // Parse paths once
    const parsedPaths = pathMappings.map((mapping) => ({
      key: mapping.key,
      pathArray: mapping.path.split('>').map((key) => key.trim()),
    }));

    // Single traversal to extract all values
    this.extractMultiplePathsRecursive(obj, parsedPaths, result, []);

    // Find the maximum length for normalization
    const maxLength = Math.max(...Object.values(result).map((arr) => arr.length));

    // Normalize arrays to same length (pad with undefined if needed)
    Object.keys(result).forEach((key) => {
      while (result[key].length < maxLength) {
        result[key].push(undefined);
      }
    });

    const endTime = Date.now();
    console.log(`✅ Batch extraction completed in ${endTime - startTime}ms`);
    console.log(`📊 Extracted ${maxLength} records for ${pathMappings.length} fields`);

    return result;
  }

  private extractMultiplePathsRecursive(
    current: any,
    pathMappings: Array<{ key: string; pathArray: string[] }>,
    result: IBatchExtractionResult,
    currentPath: string[]
  ): void {
    // Check if current path matches any of our target paths
    pathMappings.forEach((mapping) => {
      if (this.pathMatches(currentPath, mapping.pathArray)) {
        const value = this.extractValue(current);
        if (value !== undefined) {
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
        current.forEach((item) => {
          this.extractMultiplePathsRecursive(item, pathMappings, result, [...currentPath, '[]']);
        });
      } else {
        Object.keys(current).forEach((key) => {
          // Skip metadata keys
          if (key === '$' || key === '_') return;

          this.extractMultiplePathsRecursive(current[key], pathMappings, result, [...currentPath, key]);
        });
      }
    }
  }

  private pathMatches(currentPath: string[], targetPath: string[]): boolean {
    if (currentPath.length !== targetPath.length) return false;

    for (let i = 0; i < currentPath.length; i++) {
      const current = currentPath[i];
      const target = targetPath[i];

      // Handle array notation
      if (target.endsWith('[]')) {
        const targetKey = target.slice(0, -2);
        if (current !== '[]' && current !== targetKey) return false;
      } else if (current !== target) {
        return false;
      }
    }

    return true;
  }

  private extractValue(value: any): any {
    if (value === null || value === undefined) return undefined;

    // Handle objects with $ (attributes) and _ (text content)
    if (typeof value === 'object' && !Array.isArray(value)) {
      if (value._ !== undefined) return value._;
      if (value.$ !== undefined && Object.keys(value).length === 1) return undefined;
    }

    // Return primitive values
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.map((item) => this.extractValue(item)).filter((v) => v !== undefined);
    }

    return undefined;
  }

  // OPTIMIZED: New mapping function that works with batch extracted data
  async optimizedMappingFunction(mappingsData: IPathMapping[], batchResult: IBatchExtractionResult): Promise<any[]> {
    console.log('🔄 Creating optimized mapping...', batchResult);

    const result = [];
    const keys = mappingsData.map((mapping) => mapping.key);

    // Find the maximum length across all extracted arrays
    const maxLength = Math.max(...keys.map((key) => batchResult[key]?.length || 0));

    console.log('📊 Maximum length:', maxLength);

    for (let i = 0; i < maxLength; i++) {
      const item: any = {};
      keys.forEach((key) => {
        const values = batchResult[key];
        item[key] = values && values.length > i ? values[i] : undefined;
      });
      result.push(item);
    }

    console.log(`✅ Created ${result.length} mapped records`);

    return result;
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async parseXMLAndExtractData(xmlUrl: string, dataPath?: string): Promise<any> {
    console.log('🚀 Starting XML parsing...');

    const parser = new RSSXMLService(xmlUrl);

    try {
      // Parse the XML
      const xmlData = await parser.parseXML();
      // Extract keys
      const keys = await parser.printKeys(xmlData);

      return {
        keys,
        xmlData,
      };
    } catch (error) {
      console.error('💥 Error:', error);

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

  extractHeadings(node: any, path: string, headings: string[]): void {
    if (typeof node === 'object') {
      for (const key in node) {
        const newPath = path ? `${path} > ${key}` : `$ > ${key}`;
        headings.push(newPath);
        if (Array.isArray(node[key])) {
          node[key].forEach((item: any) => this.extractHeadings(item, newPath, headings));
        } else {
          this.extractHeadings(node[key], newPath, headings);
        }
      }
    }
  }

  getValueByPath(obj: any, path: string): any {
    if (!path) return undefined;

    const keys = path.split('>').map((key) => key.trim());
    let current = obj;

    for (const key of keys) {
      if (current === undefined) return undefined;

      const isArray = key.endsWith('[]');
      const actualKey = isArray ? key.slice(0, -2) : key;

      if (Array.isArray(current)) {
        current = current.flatMap((item) => (item ? item[actualKey] : undefined)).filter(Boolean);
      } else {
        current = current ? current[actualKey] : undefined;
      }

      if (isArray && !Array.isArray(current)) {
        current = current ? [current] : [];
      }
    }

    // Filter out complex objects, keep only strings, numbers, and arrays of strings/numbers
    if (Array.isArray(current)) {
      return current.filter(
        (item) =>
          typeof item === 'string' ||
          typeof item === 'number' ||
          (Array.isArray(item) && (typeof item[0] === 'string' || typeof item[0] === 'number'))
      );
    } else if (typeof current === 'string' || typeof current === 'number') {
      return current;
    }

    return current;
  }

  async printKeys(obj: Record<string, any>, prefix = '', result: Set<string> = new Set()): Promise<string[]> {
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
    console.log('Getting url as ->', this.xmlUrl);
    try {
      this.startTime = Date.now();
      this.lastSpeedCheckTime = this.startTime;
      const response = await this.fetchStream(this.xmlUrl);
      console.log(`📥 Starting XML parsing...`);

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

      response.on('data', (chunk: Buffer) => {
        this.bytesProcessed += chunk.length;
        this.showProgress();
      });

      parser.on('opentag', (node) => {
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

      return new Promise((resolve, reject) => {
        parser.on('end', async () => {
          const endTime = Date.now();
          const duration = ((endTime - this.startTime) / 1000).toFixed(2);

          console.log(`\n✅ Parsing completed!`);
          console.log(`📊 Total elements processed: ${this.totalItemsProcessed}`);
          console.log(`📁 Total data processed: ${this.formatBytes(this.bytesProcessed)}`);
          console.log(`⏱️  Processing time: ${duration}s`);
          console.log(`🚀 Average speed: ${this.formatBytesPerSecond(this.bytesProcessed / (duration as any))}`);

          const keys = await this.printKeys(xmlStructure);
          console.log('XML DATA KEYS ->', keys);

          resolve(xmlStructure);
        });

        parser.on('error', (err) => {
          console.error('❌ Parser error:', err);
          reject(err);
        });

        response.on('error', (err: any) => {
          console.error('🔴 Response error:', err);
          parser.destroy();
          reject(err);
        });

        response.on('end', () => {
          console.log('📡 Response stream ended');
        });

        console.log(`🔄 Piping response to parser...`);
        response.pipe(parser);
      });
    } catch (err) {
      console.error('🚫 Failed to parse XML:', err);

      return null;
    }
  }

  async setValue(obj: Record<string, any>, path: string[], value: any, attributes?: any): Promise<void> {
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

  async fetchStream(url: string): Promise<any> {
    console.log(`🌐 Fetching XML from: ${url}`);

    try {
      const response = await axios.get(url, {
        responseType: 'stream',
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Node.js XML Parser)',
          Accept: 'application/rss+xml, application/xml, text/xml, */*',
        },
      });

      const contentLength = response.headers['content-length'];
      if (contentLength) {
        this.totalBytes = parseInt(contentLength);
        console.log(`📊 File Size: ${this.formatBytes(this.totalBytes)}`);
      }

      console.log(`📡 Response status: ${response.status}`);

      return response.data;
    } catch (error) {
      console.error('🔴 Request error:', error);
      throw error;
    }
  }

  // Keep for backward compatibility - but mark as deprecated
  async getXMLKeyValueByPath(
    obj: Record<string, any>,
    path: string | undefined
  ): Promise<string | number | undefined | any> {
    console.warn('⚠️  getXMLKeyValueByPath is deprecated. Use getBatchXMLKeyValuesByPaths for better performance.');

    if (!path) {
      return undefined;
    }

    const keys = path.split('>').map((key) => key.trim());
    let current: any = obj;

    for (const key of keys) {
      if (current === undefined) return undefined;

      const isArray = key.endsWith('[]');
      const actualKey = isArray ? key.slice(0, -2) : key;

      if (Array.isArray(current)) {
        current = current.flatMap((item) => (item ? item[actualKey] : undefined)).filter(Boolean);
      } else {
        current = current ? current[actualKey] : undefined;
      }

      if (isArray && !Array.isArray(current)) {
        current = current ? [current] : [];
      }
    }

    if (Array.isArray(current)) {
      return current.filter(
        (item) =>
          typeof item === 'string' ||
          typeof item === 'number' ||
          (Array.isArray(item) && (typeof item[0] === 'string' || typeof item[0] === 'number'))
      );
    } else if (typeof current === 'string' || typeof current === 'number') {
      return current;
    }

    return undefined;
  }

  // Keep for backward compatibility
  async mappingFunction(mappingsData: any, values: any[]): Promise<any[]> {
    console.warn('⚠️  mappingFunction is deprecated. Use optimizedMappingFunction for better performance.');

    const result = [];
    const maxLength = Math.max(...values.map((value) => (Array.isArray(value) ? value.length : 1)));

    for (let i = 0; i < maxLength; i++) {
      const item: any = {};
      mappingsData.forEach((mapping, index) => {
        const value = values[index];
        item[mapping.key] = Array.isArray(value) ? value[i] : value;
      });
      result.push(item);
    }

    return result;
  }

  private extractDataByPath(node: any, pathArray: string[]): any[] {
    if (pathArray.length === 0) return [node];

    const [current, ...rest] = pathArray;
    const result: any[] = [];

    if (node[current]) {
      if (Array.isArray(node[current])) {
        node[current].forEach((item: any) => {
          result.push(...this.extractDataByPath(item, rest));
        });
      } else {
        result.push(...this.extractDataByPath(node[current], rest));
      }
    }

    return result;
  }

  async getMimeType(url: string): Promise<string | null> {
    try {
      const response = await axios.head(url);
      const mimeType = response.headers['content-type'] || null;

      return mimeType?.split(';')[0] || null;
    } catch (error) {
      return null;
    }
  }
}
