import { BadRequestException } from '@nestjs/common';
import { APIMessages } from '../constants';

export class UniqueEmailException extends BadRequestException {
  constructor() {
    super(APIMessages.UNIQUE_EMAIL);
  }
}
