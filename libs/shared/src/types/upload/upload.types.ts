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

export const SupportedFileMimeTypes = [
  'text/csv', // csv
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // EXCELX
  'application/vnd.ms-excel', // EXCEL
];

export enum FileMimeTypesEnum {
  'CSV' = 'text/csv',
  'EXCEL' = 'application/vnd.ms-excel',
  'EXCELX' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'JSON' = 'application/json',
}

export enum FileEncodingsEnum {
  'CSV' = 'utf8',
  'EXCEL' = 'base64',
  'EXCELX' = 'base64',
  'JSON' = 'utf8',
}

export enum QueuesEnum {
  'PROCESS_FILE' = 'PROCESS_FILE',
}

export type ProcessFileCachedData = {
  page: number;
  callbackUrl: string;
  chunkSize: number;
  code: string; // template code
  extra?: string;
  isInvalidRecords: boolean;
  processInvalidRecords: boolean;
  _templateId: string;
  validDataFilePath: string;
  invalidDataFilePath: string;
};

export type ProcessFileData = {
  uploadId: string;
  cache?: ProcessFileCachedData;
};
export type PublishToQueueData = ProcessFileData;

export interface IFileInformation {
  headings: string[];
  data: Record<string, unknown>[];
  totalRecords: number;
}
