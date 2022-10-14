export enum UploadStatusEnum {
  'UPLOADED' = 'Uploaded',
  'MAPPING' = 'Mapping',
  'MAPPED' = 'Mapped',
  'REVIEWING' = 'Reviewing',
  'REVIEWED' = 'Reviewed',
  'CONFIRMED' = 'Confirmed',
  'PROCESSING' = 'Processing',
  'COMPLETED' = 'Completed',
}

export enum SupportedFileMimeTypesEnum {
  'CSV' = 'text/csv',
  'EXCEL' = 'application/vnd.ms-excel',
  'EXCELX' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export enum FileEncodingsEnum {
  'CSV' = 'utf8',
  'EXCEL' = 'base64',
  'EXCELX' = 'base64',
}

export interface IFileInformation {
  headings: string[];
  data: Record<string, unknown>[];
  totalRecords: number;
}
