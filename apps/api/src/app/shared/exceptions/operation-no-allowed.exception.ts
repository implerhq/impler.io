import { BadRequestException } from '@nestjs/common';
import { APIMessages } from '../constants';

export class OperationNotAllowedException extends BadRequestException {
  constructor() {
    super(APIMessages.OPERATION_NOT_ALLOWED);
  }
}
