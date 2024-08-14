import { BadRequestException } from '@nestjs/common';
import { numberFormatter } from '@impler/shared';

export class FileSizeException extends BadRequestException {
  constructor({
    columns,
    recordsToSplit,
    rows,
    files,
    isExcel,
  }: {
    rows: number;
    columns: number;
    recordsToSplit: number;
    files: number;
    isExcel?: boolean;
  }) {
    super(
      `${isExcel ? `Excel sheet` : 'CSV file'} has ${numberFormatter(rows)} rows and ${numberFormatter(
        columns
      )} columns. Please split it into ${files} files of ${numberFormatter(
        recordsToSplit
      )} rows or less each and upload separately!`
    );
  }
}
