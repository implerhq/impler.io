import { UnprocessableEntityException } from '@nestjs/common';
import { APIMessages } from '../constants';

export class UserNotFoundException extends UnprocessableEntityException {
  constructor() {
    super(APIMessages.USER_NOT_FOUND);
  }
}
