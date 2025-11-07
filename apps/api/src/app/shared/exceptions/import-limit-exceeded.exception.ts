import { BadRequestException } from '@nestjs/common';

export class UsageLimitExceededException extends BadRequestException {
  constructor(message?: string) {
    super(message || 'You have exceeded your usage limit.');
  }
}
