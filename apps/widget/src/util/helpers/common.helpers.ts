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
  // Validate inputs
  if (frequency < 1 || frequency > 12) {
    throw new Error('Frequency must be between 1 and 12 months');
  }
  if (consecutiveMonths < 1 || consecutiveMonths > frequency) {
    throw new Error('Consecutive months must be between 1 and the frequency');
  }

  // Get the current month and day
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-based month
  const currentDay = currentDate.getDate(); // Day of the month (1-31)

  // Determine the starting month
  let startMonth = currentMonth;
  if (inputDay < currentDay) {
    // If inputDay is less than the current day, shift to the next month
    startMonth = (currentMonth % 12) + 1; // Move to next month, wrapping around to January if needed
  }

  const monthGroups: number[] = [];

  // Generate month patterns based on the frequency
  for (let i = 0; i < 12; i++) {
    const nextMonth = ((startMonth - 1 + i * frequency) % 12) + 1; // Loop back to 1 after December
    monthGroups.push(nextMonth);
  }

  // Remove duplicates and sort for cleaner cron expressions
  const uniqueMonths = [...new Set(monthGroups)].sort((a, b) => a - b);

  return uniqueMonths.join(',');
};

export const generateCronExpression = (data: RecurrenceFormData): string => {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const endsOn = data.endsNever ? null : data.endsOn;
  // Default to 45 minutes past 11 PM
  const minutes = 45;
  const hours = 23;

  // Helper function to get week day index
  const getWeekDayIndex = (dayName?: string): number => {
    if (!dayName) return 0;
    const matchedDay = weekDays.find((weekDay) => weekDay.full.toLowerCase() === dayName.toLowerCase());

    return matchedDay ? weekDays.indexOf(matchedDay) : 0;
  };

  // Helper function to convert day position to cron syntax
  const getDayPositionCron = (position?: string, dayIndex?: number): string => {
    if (!position || dayIndex === undefined) return '*';

    const positionCron = positionMap[position] || '1';

    // For last occurrence, append 'L' to the day index
    if (positionCron === positionMap.Last) {
      return `${dayIndex}L`; // Add 1 because cron uses 1-7 for days, not 0-6
    }

    // For specific numbered occurrences, use '#' notation
    return `${dayIndex + 1}#${positionCron}`;
  };

  // Handle "on the" type (specific day of week in month)
  if (data.monthlyType === 'onThe' && data.monthlyDayPosition && data.monthlyDayOfWeek) {
    const weekDayIndex = getWeekDayIndex(data.monthlyDayOfWeek);
    const dayPositionCron = getDayPositionCron(data.monthlyDayPosition, weekDayIndex);

    const frequency = Math.min(Math.max(1, data.frequency || 1), 12);

    // For regular monthly execution (every month)
    if (frequency === 1) {
      return `${minutes} ${hours} * * ${dayPositionCron}`;
    }

    // For custom frequency with consecutive months
    const monthPattern = calculateMonthlyPattern(frequency, frequency, 1);

    return `${minutes} ${hours} ${dayPositionCron} ${monthPattern} *`;
  }

  switch (data.recurrenceType) {
    case AUTOIMPORTSCHEDULERFREQUENCY.DAILY: {
      if (data.dailyType === 'weekdays') {
        // Runs Monday to Friday
        return `${minutes} ${hours} * * 1-5`;
      }

      if (data.dailyType === 'every' && data.dailyFrequency > 0) {
        // Runs every 'n' days
        return `${minutes} ${hours} */${data.dailyFrequency} * *`;
      }

      // Default daily: Runs every day
      return `${minutes} ${hours} * * *`;
    }

    case AUTOIMPORTSCHEDULERFREQUENCY.WEEKLY: {
      const selectedDayIndexes = (data.selectedDays || [])
        .map((selectedDay) => weekDays.findIndex((weekDay) => weekDay.full === selectedDay))
        .filter((index) => index !== -1)
        .join(',');

      // If no days are selected, return default daily schedule
      if (!selectedDayIndexes) {
        return `${minutes} ${hours} * * *`; // Default daily schedule
      }

      const frequency = Math.max(1, data.frequency || 1);

      // If frequency is 1 (standard weekly recurrence), just use the selected days
      if (frequency === 1) {
        return `${minutes} ${hours} * * ${selectedDayIndexes}`;
      } else {
        // For bi-weekly or more, apply the frequency to the selected days
        const daysWithSteps = selectedDayIndexes
          .split(',')
          .map((day) => `${day}/${frequency}`)
          .join(',');

        return `${minutes} ${hours} * * ${daysWithSteps}`;
      }
    }

    case AUTOIMPORTSCHEDULERFREQUENCY.MONTHLY: {
      // Handle regular day of month
      if (data.monthlyType === 'onDay' && data.monthlyDayNumber) {
        const day = Math.min(Math.max(1, data.monthlyDayNumber), 31);
        const frequency = Math.min(Math.max(1, data.frequency || 1), 12);

        // For regular monthly execution
        if (frequency === 1) {
          return `${minutes} ${hours} ${day} * *`;
        }

        // For custom frequency with dynamic consecutive months pattern
        const monthPattern = calculateMonthlyPattern(frequency, frequency, day);

        return `${minutes} ${hours} ${day} ${monthPattern} *`;
      }

      // Handle "on the" type (specific day of week in month)
      if (data.monthlyType === 'onThe' && data.monthlyDayPosition && data.monthlyDayOfWeek) {
        const weekDayIndex = getWeekDayIndex(data.monthlyDayOfWeek);
        const dayPositionCron = getDayPositionCron(data.monthlyDayPosition, weekDayIndex);

        const frequency = Math.min(Math.max(1, data.frequency || 1), 12);

        // For regular monthly execution (every month)
        if (frequency === 1) {
          return `${minutes} ${hours} ${dayPositionCron} * *`;
        }

        // For custom frequency with consecutive months
        const monthPattern = calculateMonthlyPattern(frequency, frequency, 1);

        return `${minutes} ${hours} ${dayPositionCron} ${monthPattern} *`;
      }

      // Default to first day of month if no specific configuration
      return `${minutes} ${hours} 1 * *`;
    }

    case AUTOIMPORTSCHEDULERFREQUENCY.YEARLY: {
      const monthIndex = months.findIndex((month) => month === data.yearlyMonth) + 1;
      const validMonthIndex = monthIndex > 0 ? monthIndex : 1;

      // Handle regular day of month
      if (data.yearlyType === 'onDay' && data.yearlyDayNumber) {
        return `${minutes} ${hours} ${data.yearlyDayNumber} ${validMonthIndex} *`;
      }

      // Handle "on the" type for yearly recurrence
      if (data.yearlyType === 'onThe' && data.yearlyDayPosition && data.yearlyDayOfWeek) {
        const weekDayIndex = getWeekDayIndex(data.yearlyDayOfWeek);

        // For last occurrence of a specific day
        if (data.yearlyDayPosition === 'Last') {
          return `${minutes} ${hours} * ${validMonthIndex} ${weekDayIndex + 1}L`;
        }

        // For other positions (First, Second, Third, Fourth)
        const positionCron = positionMap[data.yearlyDayPosition] || '1';

        return `${minutes} ${hours} * ${validMonthIndex} ${weekDayIndex + 1}#${positionCron}`;
      }

      // Default to first day of the specified month
      return `${minutes} ${hours} 1 ${validMonthIndex} *`;
    }

    default:
      return `${minutes} ${hours} * * *`;
  }
};
