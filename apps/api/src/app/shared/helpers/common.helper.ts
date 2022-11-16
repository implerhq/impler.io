import { BadRequestException } from '@nestjs/common';
import { APIMessages } from '../constants';
import { PaginationResult } from '@impler/shared';

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
  if (!page || page < 1) page = 1;
  if (!limit || limit < 1) limit = 1;
  if (!Array.isArray(data))
    return {
      data: [],
      limit,
      page,
      totalPages: 0,
      totalRecords: 0,
    };

  const sliceFrom = Math.max((page - 1) * limit, 0);
  const sliceTo = Math.min(page * limit, data.length);

  return {
    data: data.slice(sliceFrom, sliceTo),
    limit,
    page,
    totalPages: Math.ceil(data.length / limit),
    totalRecords: data.length,
  };
}
