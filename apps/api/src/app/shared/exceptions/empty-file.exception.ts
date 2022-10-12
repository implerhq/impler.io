import { BadRequestException } from '@nestjs/common';
import { APIMessages } from '../constants';

export class EmptyFileException extends BadRequestException {
  constructor() {
    super(APIMessages.FILE_IS_EMPTY);
  }
}
