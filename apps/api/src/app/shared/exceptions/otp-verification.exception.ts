import { HttpException, HttpStatus } from '@nestjs/common';
import { APIMessages } from '../constants';

export class InvalidVerificationCodeException extends HttpException {
  constructor() {
    super(
      {
        message: APIMessages.INVALID_VERIFICATION_CODE,
        error: 'OTPVerificationFalid',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
