export enum UploadStatusEnum {
  'MAPPING' = 'Mapping',
  'REVIEWING' = 'Reviewing',
  'REVIEWED' = 'Reviewed',
  'CONFIRMED' = 'Confirmed',
  'PROCESSING' = 'Processing',
  'COMPLETED' = 'Completed',
}

export enum SupportedFileMimeTypesEnum {
  'CSV' = 'text/csv',
  'XML' = 'application/xml',
  'EXCEL' = 'application/vnd.ms-excel',
  'EXCELX' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export interface IFileInformation {
  headings: string[];
  data: Record<string, unknown>[];
  totalRecords: number;
}
