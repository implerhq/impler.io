import { BadRequestException } from '@nestjs/common';
import { APIMessages } from '../constants';
import { numberFormatter, replaceVariablesInString } from '@impler/shared';

export class FileSizeException extends BadRequestException {
  constructor({
    columns,
    recordsToSplit,
    rows,
    files,
  }: {
    rows: number;
    columns: number;
    recordsToSplit: number;
    files: number;
  }) {
    super(
      replaceVariablesInString(APIMessages.FILE_SIZE_EXCEEDED, {
        files: '' + files,
        rows: numberFormatter(rows),
        columns: numberFormatter(columns),
        records: numberFormatter(recordsToSplit),
      })
    );
  }
}
