import { BadRequestException } from '@nestjs/common';
import { numberFormatter } from '@impler/shared';

export class MaxRecordsExceededException extends BadRequestException {
  constructor({ maxAllowed, customMessage = null }: { maxAllowed: number; customMessage?: string }) {
    super(customMessage || `You can not import more than ${numberFormatter(maxAllowed)} records.`);
  }
}
