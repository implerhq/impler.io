import { BadRequestException } from '@nestjs/common';
import { APIMessages } from '../constants';

export class FileParseError extends BadRequestException {
  constructor() {
    super(APIMessages.FILE_HAS_ISSUE);
  }
}
