import { UnprocessableEntityException } from '@nestjs/common';
import { APIMessages } from '../constants';

export class UniqueColumnException extends UnprocessableEntityException {
  constructor(message?: string) {
    super(message || APIMessages.COLUMN_KEY_DUPLICATED);
  }
}
