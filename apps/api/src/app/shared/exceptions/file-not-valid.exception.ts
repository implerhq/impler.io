import { UnprocessableEntityException } from '@nestjs/common';
import { APIMessages } from '../constants';

export class FileNotValidError extends UnprocessableEntityException {
  constructor() {
    super(APIMessages.FILE_TYPE_NOT_VALID);
  }
}
