import { BadRequestException } from '@nestjs/common';
import { APIMessages } from '../constants';
import { PaginationResult, Defaults } from '@impler/shared';

export function validateNotFound(data: any, entityName: 'upload'): boolean {
  if (data) return true;
  else {
    switch (entityName) {
      case 'upload':
        throw new BadRequestException(APIMessages.UPLOAD_NOT_FOUND);
      default:
        throw new BadRequestException();
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
