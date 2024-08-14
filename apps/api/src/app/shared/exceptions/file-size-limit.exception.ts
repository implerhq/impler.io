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
      `File too large: ${numberFormatter(rows)} rows and ${numberFormatter(columns)} columns detected. ` +
        `Please split into ${files} ${isExcel ? 'Excel' : 'CSV'} file${files > 1 ? 's' : ''} ` +
        `of ${numberFormatter(recordsToSplit)} rows or less each and upload separately!`
    );
  }
}
