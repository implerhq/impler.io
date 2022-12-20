import { BadRequestException } from '@nestjs/common';
import { APIMessages } from '../constants';

export class InvalidFileException extends BadRequestException {
  constructor() {
    super(APIMessages.FILE_CONTENT_INVALID);
  }
}
