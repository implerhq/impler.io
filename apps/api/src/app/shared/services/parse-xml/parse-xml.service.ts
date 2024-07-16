import * as xml2js from 'xml2js';
import axios from 'axios';
import { keysToOmit } from './keysToOmit';
import { IMappedResult, IMapping, IXmlObject } from '@shared/types/parse-xml.types';

const parseXmlFromUrl = async (url: string): Promise<IXmlObject> => {
  try {
    const parser = new xml2js.Parser({ strict: false });
    const response = await axios.get(url);
    const xmlData = response.data;
    const parsedData = await parser.parseStringPromise(xmlData);

    return JSON.parse(JSON.stringify(parsedData).toLocaleLowerCase());
  } catch (error) {
    throw error;
  }
};

function printKeys(obj: IXmlObject, prefix = '', result: Set<string> = new Set()): string[] {
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      const newPrefix = `${prefix}`;
      printKeys(item, newPrefix, result);
    });
  } else if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach((key) => {
      const newPrefix = prefix ? `${prefix} > ${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        printKeys(obj[key], newPrefix, result);
      } else if (typeof obj[key] === 'string' || typeof obj[key] === 'number') {
        result.add(newPrefix);
      }
    });
  } else {
    result.add(prefix);
  }

  return Array.from(new Set([...result].filter((key) => !keysToOmit.has(key))));
}

function getValueByPath(obj: IXmlObject, path: string): any {
  const keys = path.split('>').map((key) => key.trim());
  let current: any = obj;
  try {
    for (const key of keys) {
      if (current === undefined) {
        return undefined;
      }
      if (Array.isArray(current)) {
        current = current.flatMap((item) => item[key]);
      } else {
        current = current[key];
      }
    }
    if (Array.isArray(current) && current.length === 1) {
      return current[0];
    }

    return current;
  } catch (error) {}
}

function mappingFunction(mappings: IMapping[], values: any[]): IMappedResult[] {
  const mappedObject: IMappedResult = {};
  mappings.forEach((mapping, index) => {
    mappedObject[mapping.key] = values[index];
  });

  return [mappedObject];
}

export async function parseRssFeed(url: string): Promise<{
  rssKeyHeading: string[];
  mappedObject: IMappedResult[];
}> {
  try {
    const outputFile = await parseXmlFromUrl(url);
    const rssKeyHeading = printKeys(outputFile);

    const mappings: IMapping[] = [
      { key: 'title', mapping: 'rss > channel > title' },
      { key: 'description', mapping: 'rss > channel > description' },
      { key: 'lastBuildDate', mapping: 'rss > channel > lastbuilddate' },
      { key: 'latestItemTitle', mapping: 'rss > channel > item > title' },
    ];

    const returnedValues = mappings.map(({ mapping }) => getValueByPath(outputFile, mapping));
    const mappedObject = mappingFunction(mappings, returnedValues);

    return { rssKeyHeading, mappedObject };
  } catch (error) {
    throw error;
  }
}
