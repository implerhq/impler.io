import * as Sentry from '@sentry/node';
import axios from 'axios';
import { BadRequestException } from '@nestjs/common';
import { APIMessages } from '../constants';
import { PaginationResult, Defaults, FileMimeTypesEnum } from '@impler/shared';

export function validateNotFound(data: any, entityName: 'upload' | 'template'): boolean {
  if (data) return true;
  else {
    switch (entityName) {
      case 'upload':
        throw new BadRequestException(APIMessages.UPLOAD_NOT_FOUND);
      case 'template':
        throw new BadRequestException(APIMessages.TEMPLATE_NOT_FOUND);
      default:
        throw new BadRequestException();
    }
  }
}

export function mergeObjects(obj1: any, obj2: any, keysToMerge: string[]) {
  for (const key of keysToMerge) {
    if (obj2.hasOwnProperty(key)) {
      obj1[key] = obj2[key];
    }
  }
}

export function paginateRecords(data: any[], page: number, limit: number): PaginationResult {
  if (!page || Number(page) < Defaults.ONE) page = Defaults.ONE;
  else page = Number(page);
  if (!limit || Number(limit) < Defaults.ONE) limit = Defaults.ONE;
  else limit = Number(limit);
  if (!Array.isArray(data))
    return {
      data: [],
      limit,
      page,
      totalPages: 0,
      totalRecords: 0,
    };

  const sliceFrom = Math.max((page - Defaults.ONE) * limit, Defaults.ZERO);
  const sliceTo = Math.min(page * limit, data.length);

  return {
    data: data.slice(sliceFrom, sliceTo),
    limit,
    page,
    totalPages: Math.ceil(data.length / limit),
    totalRecords: data.length,
  };
}

export function isDateString(date: string | number): boolean {
  if (!date) return false;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new Date(date) != 'Invalid Date' && !isNaN(new Date(date));
}

export function getAssetMimeType(name: string): string {
  if (name.endsWith('.png')) return FileMimeTypesEnum.PNG;
  else if (name.endsWith('.jpg')) return FileMimeTypesEnum.JPEG;
  else if (name.endsWith('.jpeg')) return FileMimeTypesEnum.JPEG;
  else if (name.endsWith('.webp')) return FileMimeTypesEnum.WEBP;
  throw new Error('Unsupported file type');
}

export function generateVerificationCode(): string {
  let otp = '';

  for (let i = 0; i < 2; i++) {
    const group = Math.floor(Math.random() * 900) + 100;
    otp += group.toString();
  }

  return otp;
}

export function captureException(error: any) {
  if (Sentry.isInitialized()) {
    Sentry.captureException(error);
  } else console.error(error);
}

export function isValidXMLMimeType(mimeType: string): boolean {
  if (
    mimeType === FileMimeTypesEnum.XML ||
    mimeType === FileMimeTypesEnum.TEXTXML ||
    mimeType === FileMimeTypesEnum.APPLICATION_XML
  ) {
    return true;
  }

  return false;
}

export const getMimeType = async (url: string): Promise<string | null> => {
  if (!isUrlSafe(url)) {
    throw new BadRequestException('Invalid URL');
  }

  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    Accept: 'application/rss+xml, application/xml, text/xml, */*',
  };

  // Try HEAD request first
  try {
    const response = await axios.head(url, {
      timeout: 10000,
      maxRedirects: 3,
      headers,
    });

    const mimeType = response.headers['content-type'] || null;

    return mimeType?.split(';')[0] || null;
  } catch (headError) {
    // If HEAD fails with 400, 405 (Method Not Allowed), 403 (Forbidden), or 429 (Too Many Requests), fallback to GET
    if (headError.response && [400, 405, 403, 429].includes(headError.response.status)) {
      try {
        const response = await axios.get(url, {
          timeout: 15000,
          maxRedirects: 3,
          headers,
          responseType: 'stream',
        });

        const mimeType = response.headers['content-type'] || null;
        // Destroy the stream as we only need the headers
        if (response.data && typeof response.data.destroy === 'function') {
          response.data.destroy();
        }

        return mimeType?.split(';')[0] || null;
      } catch (getError) {
        throw getError;
      }
    }
    throw headError;
  }
};

export function isUrlSafe(url: string): boolean {
  try {
    const parsedUrl = new URL(url);

    // Only allow HTTP and HTTPS
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }

    // Block localhost and private IPs (except in development)
    const hostname = parsedUrl.hostname.toLowerCase();
    const isDevelopment = process.env.NODE_ENV === 'dev';

    if (!isDevelopment && ['localhost', '127.0.0.1', '::1'].includes(hostname)) {
      return false;
    }

    if (
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('169.254.') ||
      /^172\.(1[6-9]|2[0-9]|3[01])\./.test(hostname)
    ) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

export default { getMimeType };
