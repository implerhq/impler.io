import { BadRequestException } from '@nestjs/common';
import { APIMessages } from '../constants';

export class IncorrectLoginCredentials extends BadRequestException {
  constructor() {
    super(APIMessages.INCORRECT_LOGIN_CREDENTIALS);
  }
}
