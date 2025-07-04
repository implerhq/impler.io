/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import * as Sentry from '@sentry/react';
import axios from 'axios';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';
import { AUTOIMPORTSCHEDULERFREQUENCY, months, positionMap, variables, weekDays } from '@config';
import { WIDGET_TEXTS, isObject } from '@impler/client';
import { convertStringToJson, downloadFile, FileMimeTypesEnum } from '@impler/shared';
import { RecurrenceFormData } from 'types/component.types';

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

export function buildFullFileUrl(signedUrl: string, queryVariables: string[], baseIndex: number) {
  const filePath = queryVariables[baseIndex];
  const url = new URL(signedUrl);
  const fileUrl = `${url.origin}${url.pathname}${filePath}${url.search}`;

  return fileUrl;
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

export const isValidFileType = (sampleFile: Blob): boolean => {
  if (
    sampleFile instanceof Blob &&
    [FileMimeTypesEnum.CSV, FileMimeTypesEnum.EXCEL, FileMimeTypesEnum.EXCELM, FileMimeTypesEnum.EXCELX].includes(
      sampleFile.type as FileMimeTypesEnum
    )
  )
    return true;

  return false;
};

const calculateMonthlyPattern = (frequency: number, consecutiveMonths = 1, inputDay: number): string => {
  if (frequency < 1 || frequency > 12) {
    throw new Error('Frequency must be between 1 and 12 months');
  }
  if (consecutiveMonths < 1 || consecutiveMonths > frequency) {
    throw new Error('Consecutive months must be between 1 and the frequency');
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  let startMonth = currentMonth;
  if (inputDay < currentDay) {
    startMonth = (currentMonth % 12) + 1;
  }

  const monthGroups: number[] = [];

  for (let i = 0; i < 12; i++) {
    const nextMonth = ((startMonth - 1 + i * frequency) % 12) + 1;
    monthGroups.push(nextMonth);
  }

  const uniqueMonths = [...new Set(monthGroups)].sort((a, b) => a - b);

  return uniqueMonths.join(',');
};

export const generateCronExpression = (data: RecurrenceFormData): string => {
  const minutes = 45;
  const hours = 23;

  const getMonthlyWeekDayIndex = (dayName?: string): number => {
    if (!dayName) return 0;
    const matchedDay = weekDays.find((weekDay) => weekDay.full.toLowerCase() === dayName.toLowerCase());

    return matchedDay ? weekDays.indexOf(matchedDay) : 0;
  };

  const getYearlyWeekDayIndex = (dayName?: string): number => {
    if (!dayName) return 0;
    const matchedDay = weekDays.find((weekDay) => weekDay.full.toLowerCase() === dayName.toLowerCase());

    return matchedDay ? weekDays.indexOf(matchedDay) : 0;
  };

  const getWeekDayIndex = (dayName?: string): number => {
    if (!dayName) return 0;
    const matchedDay = weekDays.find((weekDay) => weekDay.full.toLowerCase() === dayName.toLowerCase());

    return matchedDay ? weekDays.indexOf(matchedDay) : 0;
  };

  const getDayPositionCron = (position?: string, dayIndex?: number): string => {
    if (!position || dayIndex === undefined) return '*';

    const positionCron = positionMap[position] || '1';

    if (positionCron === positionMap.Last) {
      return `${dayIndex}L`;
    }

    return `${dayIndex}#${positionCron}`;
  };

  if (data.monthlyType === 'onThe' && data.monthlyDayPosition && data.monthlyDayOfWeek) {
    const weekDayIndex = getWeekDayIndex(data.monthlyDayOfWeek);
    const dayPositionCron = getDayPositionCron(data.monthlyDayPosition, weekDayIndex);

    const frequency = Math.min(Math.max(1, data.frequency || 1), 12);

    if (frequency === 1) {
      return `${minutes} ${hours} * * ${dayPositionCron}`;
    }

    const monthPattern = calculateMonthlyPattern(frequency, frequency, 1);

    return `${minutes} ${hours} ${dayPositionCron} ${monthPattern} *`;
  }

  if (data.monthlyType === 'onThe' && data.monthlyDayPosition && data.monthlyDayOfWeek) {
    const weekDayIndex = getWeekDayIndex(data.monthlyDayOfWeek);
    const dayPositionCron = getDayPositionCron(data.monthlyDayPosition, weekDayIndex);

    const frequency = Math.min(Math.max(1, data.frequency || 1), 12);

    if (frequency === 1) {
      return `${minutes} ${hours} * * ${dayPositionCron}`;
    }

    const monthPattern = calculateMonthlyPattern(frequency, frequency, 1);

    return `${minutes} ${hours} ${dayPositionCron} ${monthPattern} *`;
  }

  switch (data.recurrenceType) {
    case AUTOIMPORTSCHEDULERFREQUENCY.DAILY: {
      if (data.dailyType === 'weekdays') {
        return `${minutes} ${hours} * * 1-5`;
      }

      if (data.dailyType === 'every' && data.dailyFrequency > 0) {
        return `${minutes} ${hours} */${data.dailyFrequency} * *`;
      }

      return `${minutes} ${hours} * * *`;
    }
    case AUTOIMPORTSCHEDULERFREQUENCY.WEEKLY: {
      const selectedDayIndexes = (data.selectedDays || [])
        .map((selectedDay) => {
          const index = weekDays.findIndex((weekDay) => weekDay.full === selectedDay);

          return index;
        })
        .filter((index) => index !== -1)
        .sort((a, b) => a - b);

      const frequency = Math.max(1, data.frequency || 1);

      if (selectedDayIndexes.length === 0) {
        const cronExpression = frequency > 1 ? `${minutes} ${hours} * * */${frequency}` : `${minutes} ${hours} * * *`;

        return cronExpression;
      }

      const cronDays = selectedDayIndexes.map((index) => (index === 0 ? 7 : index));

      if (frequency > 1) {
        const daysWithFrequency = cronDays.map((day) => `${day}/${frequency}`).join(',');

        return `${minutes} ${hours} * * ${daysWithFrequency}`;
      }

      return `${minutes} ${hours} * * ${cronDays.join(',')}`;
    }

    case AUTOIMPORTSCHEDULERFREQUENCY.MONTHLY: {
      if (data.monthlyType === 'onDay' && data.monthlyDayNumber) {
        const day = Math.min(Math.max(1, data.monthlyDayNumber), 31);
        const frequency = Math.min(Math.max(1, data.frequency || 1), 12);

        if (frequency === 1) {
          return `${minutes} ${hours} ${day} * *`;
        }

        const monthPattern = calculateMonthlyPattern(frequency, frequency, day);

        return `${minutes} ${hours} ${day} ${monthPattern} *`;
      }

      if (data.monthlyType === 'onThe' && data.monthlyDayPosition && data.monthlyDayOfWeek) {
        const weekDayIndex = getMonthlyWeekDayIndex(data.monthlyDayOfWeek);
        const dayPositionCron = getDayPositionCron(data.monthlyDayPosition, weekDayIndex);
        const frequency = Math.min(Math.max(1, data.frequency || 1), 12);

        if (frequency === 1) {
          return `${minutes} ${hours} * * ${dayPositionCron}`;
        }

        const monthPattern = calculateMonthlyPattern(frequency, frequency, 1);

        return `${minutes} ${hours} ${dayPositionCron} ${monthPattern} *`;
      }

      return `${minutes} ${hours} 1 * *`;
    }

    case AUTOIMPORTSCHEDULERFREQUENCY.YEARLY: {
      const monthIndex = months.findIndex((month) => month === data.yearlyMonth) + 1;
      const validMonthIndex = monthIndex > 0 ? monthIndex : 1;

      if (data.yearlyType === 'onDay' && data.yearlyDayNumber) {
        return `${minutes} ${hours} ${data.yearlyDayNumber} ${validMonthIndex} *`;
      }

      if (data.yearlyType === 'onThe' && data.yearlyDayPosition && data.yearlyDayOfWeek) {
        const weekDayIndex = getYearlyWeekDayIndex(data.yearlyDayOfWeek);

        if (data.yearlyDayPosition === 'Last') {
          return `${minutes} ${hours} * ${validMonthIndex} ${weekDayIndex}L`;
        }

        const positionCron = positionMap[data.yearlyDayPosition] || '1';

        return `${minutes} ${hours} * ${validMonthIndex} ${weekDayIndex}#${positionCron}`;
      }

      return `${minutes} ${hours} 1 ${validMonthIndex} *`;
    }

    default:
      return `${minutes} ${hours} * * *`;
  }
};

export function generateSessionId(length = 16, type: 'numbers' | 'alphanumeric' | 'hex' = 'alphanumeric'): string {
  if (!window.crypto || !window.crypto.getRandomValues) {
    throw new Error('Crypto API not available. Use HTTPS or modern browser.');
  }

  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);

  let charset: string;
  switch (type) {
    case 'numbers':
      charset = '0123456789';
      break;
    case 'hex':
      charset = '0123456789abcdef';
      break;
    case 'alphanumeric':
    default:
      charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      break;
  }

  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[array[i] % charset.length];
  }

  return result;
}
