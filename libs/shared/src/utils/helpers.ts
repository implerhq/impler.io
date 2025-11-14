import { isObject } from '@impler/client';

export const changeToCode = (str = '') =>
  str
    ?.replace(/[^\s\w]/gi, '')
    ?.toUpperCase()
    ?.replace(/ /g, '_');

export function isBrowser() {
  return typeof window !== 'undefined';
}

export function getErrorObject(error: string): Record<string, string> {
  if (!error) return {};
  const errorStrs = error.split(`, `);
  let fieldName: string;

  return errorStrs.reduce((acc: Record<string, string>, val: string) => {
    [, fieldName] = val.split(/`/);
    acc[fieldName] = val;

    return acc;
  }, {});
}

const defaultDigits = 2;
export function numberFormatter(num: number, digits = defaultDigits) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (lookupItem) {
      return num >= lookupItem.value;
    });

  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
}

export function replaceVariablesInString(str: string, obj: Record<string, string>): string {
  return str.replace(/{([^{}]*)}/g, function (a, b) {
    const value = obj[b];

    return typeof value === 'string' || typeof value === 'number' ? value : a;
  });
}

export function downloadFile(blob: Blob, name: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();

  // Clean up and remove the link
  link.parentNode?.removeChild(link);
}

export function constructQueryString(obj: Record<string, string | number | undefined>): string {
  const arr = [];
  Object.keys(obj).forEach((key: string) => {
    if (obj[key] !== undefined && obj[key] !== null)
      arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
  });
  const query = arr.join('&');

  return query ? `?${query}` : '';
}

export const convertStringToJson = (value: any) => {
  if (isObject(value)) return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    return undefined;
  }
};

export function handleApiError({
  axiosInstance,
  error,
  context,
  shouldLog,
}: {
  axiosInstance: any;
  error: any;
  context?: string;
  shouldLog?: boolean;
}): string | IErrorDetails {
  const isAxios = axiosInstance.isAxiosError(error);
  const errorDetails: IErrorDetails = isAxios
    ? {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        url: error.config?.url,
        method: error.config?.method,
        context,
      }
    : {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        context,
      };

  if (shouldLog) {
    // eslint-disable-next-line no-console
    console.error(`API Error${context ? ` [${context}]` : ''}:`, errorDetails);
  }

  if (errorDetails.response && typeof errorDetails.response === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = errorDetails.response as any;

    // Check for common API error message patterns
    if (response.message) {
      return response.message;
    }
    if (response.error && typeof response.error === 'string') {
      return response.error;
    }
    if (response.errors && Array.isArray(response.errors) && response.errors.length > 0) {
      return response.errors[0].message || response.errors[0];
    }
  }

  // Fallback to generic message based on status code
  if (errorDetails.status) {
    switch (errorDetails.status) {
      case 400:
        return 'Bad request. Please check your input data.';
      case 401:
        return 'Authentication failed. Please check your credentials.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return errorDetails.message || 'An unexpected error occurred.';
    }
  }

  return errorDetails;
}

interface IErrorDetails {
  message: string;
  response?: unknown;
  status?: number;
  statusText?: string;
  headers?: unknown;
  url?: string;
  method?: string;
  stack?: string;
  context?: string;
}
