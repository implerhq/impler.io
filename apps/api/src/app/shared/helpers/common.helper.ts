import { BadRequestException } from '@nestjs/common';
import { APIMessages } from '../constants';

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
