import * as Sentry from '@sentry/node';
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
