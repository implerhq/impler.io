import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export class RSSService {
  public getHeadings(xmlData: string): string[] {
    const headings: string[] = [];
    this.extractHeadings(xmlData, '', headings);

    return headings;
  }
  async parseXML(xmlContent: string) {
    return await parseStringPromise(xmlContent);
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

  public getDataByHeading(xmlData: string, heading: string): any[] {
    const pathArray = heading.split(' > ').map((part) => part.replace('[]', ''));

    return this.extractDataByPath(xmlData, pathArray);
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

  async parseRssFeed(url: string): Promise<{
    rssKeyHeading: string[];
    xmlData: Record<string, any>;
  }> {
    try {
      const xmlData = await this.parseXmlFromUrl(url);
      const rssKeyHeading = this.printKeys(xmlData);

      return { rssKeyHeading, xmlData };
    } catch (error) {
      throw error;
    }
  }
  printKeys(obj: Record<string, any>, prefix = '', result: Set<string> = new Set()): string[] {
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
  async parseXmlFromUrl(url: string): Promise<Record<string, any>> {
    try {
      const response = await axios.get(url);
      const xmlData = response.data;

      return this.parseXML(xmlData);
    } catch (error) {
      throw error;
    }
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
