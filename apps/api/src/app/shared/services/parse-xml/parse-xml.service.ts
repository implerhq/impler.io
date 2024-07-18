import { parseStringPromise } from 'xml2js';
import axios from 'axios';
import { keysToOmit } from './keysToOmit';
import { IMappedResult, IMapping, IXmlObject } from '@shared/types/parse-xml.types';

export async function getMimeType(url: string): Promise<string | null> {
  try {
    const response = await axios.head(url);
    const mimeType = response.headers['content-type'] || null;

    return mimeType?.split(';')[0] || null;
  } catch (error) {
    return null;
  }
}

class XMLParserService {
  xmlData: any;

  constructor(xmlContent: string) {
    this.parseXML(xmlContent);
  }

  async parseXML(xmlContent: string): Promise<void> {
    this.xmlData = await parseStringPromise(xmlContent);
  }

  public getHeadings(): string[] {
    const headings: string[] = [];
    this.extractHeadings(this.xmlData, '', headings);

    return headings;
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

  public getDataByHeading(heading: string): any[] {
    const pathArray = heading.split(' > ').map((part) => part.replace('[]', ''));

    return this.extractDataByPath(this.xmlData, pathArray);
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
}

const parseXmlFromUrl = async (url: string): Promise<IXmlObject> => {
  try {
    const response = await axios.get(url);
    const xmlData = response.data;
    const parserService = new XMLParserService(xmlData);

    await parserService.parseXML(xmlData);

    return parserService.xmlData;
  } catch (error) {
    throw error;
  }
};

function printKeys(obj: IXmlObject, prefix = '', result: Set<string> = new Set()): string[] {
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      const newPrefix = `${prefix}[]`;
      printKeys(item, newPrefix, result);
    });
  } else if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach((key) => {
      const newPrefix = prefix ? `${prefix} > ${key}` : key;
      result.add(newPrefix);
      printKeys(obj[key], newPrefix, result);
    });
  }

  return Array.from(new Set([...result].filter((key) => !keysToOmit.has(key))));
}

function getValueByPath(obj: IXmlObject, path: string): any {
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

  // Apply conditions to filter the result
  if (Array.isArray(current)) {
    return current.filter(
      (item) =>
        typeof item === 'string' ||
        typeof item === 'number' ||
        (Array.isArray(item) && item.every((subItem) => typeof subItem === 'string' || typeof subItem === 'number'))
    );
  } else if (typeof current === 'string' || typeof current === 'number') {
    return current;
  }

  return undefined;
}
function mapXmlToObject(xmlData: IXmlObject): IMappedResult {
  const mappings: IMapping[] = [
    { key: 'Title', mapping: 'rss > channel > title' },
    { key: 'Description', mapping: 'rss > channel > description' },
    { key: 'Link', mapping: 'rss > channel > link' },

    { key: 'title', mapping: 'rss > channel[] > item[] > title' },
    { key: 'link', mapping: 'rss > channel[] > item[] > link' },
    { key: 'pubdate', mapping: 'rss > channel[] > item[] > pubDate' },
  ];

  const returnedValues = mappings.map(({ mapping }) => getValueByPath(xmlData, mapping));
  const mappedObject = mappingFunction(mappings, returnedValues);

  return mappedObject;
}

function mappingFunction(mappings: IMapping[], values: any[]): IMappedResult {
  const mappedObject: IMappedResult = {};
  const arrayFields: string[] = [];

  mappings.forEach((mapping, index) => {
    mappedObject[mapping.key] = values[index];
    if (Array.isArray(values[index])) {
      arrayFields.push(mapping.key);
    }
  });

  if (arrayFields.length > 0) {
    const maxLength = Math.max(...arrayFields.map((field) => mappedObject[field]?.length ?? 0));

    const combinedArray = Array.from({ length: maxLength }, (_, index) => {
      const item: any = {};

      arrayFields.forEach((field) => {
        if (mappedObject[field]?.[index] !== undefined) {
          item[field.replace('s', '')] = mappedObject[field][index];
        }
      });

      mappings
        .filter((mapping) => !arrayFields.includes(mapping.key))
        .forEach((mapping) => {
          item[mapping.key] = mappedObject[mapping.key];
        });

      return item;
    });

    mappedObject.items = combinedArray;
    arrayFields.forEach((field) => delete mappedObject[field]);
  }

  return mappedObject;
}

export async function parseRssFeed(url: string): Promise<{
  rssKeyHeading: string[];
  mappedObject: IMappedResult;
}> {
  try {
    const outputFile = await parseXmlFromUrl(url);
    const rssKeyHeading = printKeys(outputFile);
    const mappedObject = mapXmlToObject(outputFile);

    return { rssKeyHeading, mappedObject };
  } catch (error) {
    throw error;
  }
}
