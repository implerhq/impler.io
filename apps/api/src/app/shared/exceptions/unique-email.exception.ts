import { HttpException, HttpStatus } from '@nestjs/common';
import { APIMessages } from '../constants';

export class UniqueEmailException extends HttpException {
  constructor() {
    super(
      {
        message: APIMessages.EMAIL_ALREADY_EXISTS,
        error: 'EmailAlreadyExists',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      },
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }
}
