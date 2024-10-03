import * as Sentry from '@sentry/react';
import axios from 'axios';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';
import { variables } from '@config';
import { WIDGET_TEXTS, isObject } from '@impler/client';
import { convertStringToJson, downloadFile } from '@impler/shared';

// eslint-disable-next-line no-magic-numbers
export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const KBSize = 1024;
  // eslint-disable-next-line no-magic-numbers
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(KBSize));

  return `${parseFloat((bytes / Math.pow(KBSize, i)).toFixed(dm))} ${sizes[i]}`;
}

function isValidHttpUrl(string: string) {
  let url: URL | undefined;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

function fetchFile(urlToFetch: string, name: string) {
  axios({
    url: urlToFetch,
    method: 'GET',
    // headers: headers,
    responseType: 'blob', // important
  }).then((response) => {
    downloadFile(new Blob([response.data]), name);

    return response;
  });
}

export function downloadFileFromURL(url: string, name: string) {
  if (!isValidHttpUrl(url)) return;

  fetchFile(url, name);
}

export function getFileNameFromUrl(url: string) {
  if (!isValidHttpUrl(url)) return '';
  const formedUrl = new URL(url);
  let pathArr = formedUrl.pathname.split('/');
  pathArr = pathArr.splice(variables.secondIndex);

  return pathArr.join('/');
}

export function captureError(error: any) {
  if (Sentry.isInitialized()) Sentry.captureException(error);
  // eslint-disable-next-line no-console
  else console.error(error);
}
export function isValidCronCharacter(value: string): boolean {
  //const cronCharacterRegex = /^[0-9*,/\-?]+$/; // This will not accept the letters like for example FRI
  const cronCharacterRegex = /^[0-9*,/\-?A-Za-z]+$/;

  return cronCharacterRegex.test(value);
}

export const validateRssUrl = {
  required: 'RSS URL is required',
  pattern: {
    value: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\.?(:\d+)?)(\/[^\s]*)?$/,
    message: 'Please Enter a valid RSS Feed URL',
  },
};
export const getObjectId = (math = Math, date = Date, hr = 16, sec = (sp: number) => math.floor(sp).toString(hr)) =>
  sec(date.now() / 1000) + ' '.repeat(hr).replace(/./g, () => sec(math.random() * hr));

export const getColumnDescription = (columnIndex: number, descriptions: string[]): string | null => {
  return descriptions[columnIndex] || null;
};

export const addTippyToElement = (element: SVGSVGElement | HTMLElement, content: string) => {
  if (!element || !content) return;

  tippy(element, {
    content,
    arrow: true,
    duration: 300,
    theme: 'custom',
    animation: 'shift-away',
  });
};

// Utility function to deeply merge defaultTexts with user provided texts
export function deepMerge(
  defaultTexts: typeof WIDGET_TEXTS,
  texts?: string | typeof WIDGET_TEXTS
): typeof WIDGET_TEXTS {
  if (!texts) return defaultTexts;
  let newTexts: typeof WIDGET_TEXTS | undefined;
  if (typeof texts === 'string') newTexts = convertStringToJson(texts);
  else newTexts = texts;
  if (newTexts && !isObject(newTexts)) return defaultTexts;
  else {
    const mergedResult = { ...defaultTexts };
    for (const sectionKey in newTexts) {
      if (isObject(newTexts[sectionKey])) {
        for (const textKey in newTexts[sectionKey]) {
          if (mergedResult[sectionKey][textKey] && typeof newTexts[sectionKey][textKey] === 'string') {
            mergedResult[sectionKey][textKey] = newTexts[sectionKey][textKey];
          }
        }
      }
    }

    return mergedResult;
  }
}

export function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: any;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn.apply(this, args);
    cache.set(key, result);

    return result;
  } as T;
}
