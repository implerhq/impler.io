import { BadRequestException } from '@nestjs/common';
import { numberFormatter } from '@impler/shared';

export class MaxRecordsExceededException extends BadRequestException {
  constructor({
    actualRecords,
    maxAllowed,
    customMessage = null,
  }: {
    actualRecords: number;
    maxAllowed: number;
    customMessage?: string;
  }) {
    super(
      customMessage ||
        `File exceeds maximum record limit: ${numberFormatter(actualRecords)} records detected, 
        but maximum allowed is ${numberFormatter(maxAllowed)} records. 
        Please reduce your data to ${numberFormatter(maxAllowed)} rows or less!`
    );
  }
}
