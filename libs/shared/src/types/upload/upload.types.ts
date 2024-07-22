import { DestinationsEnum } from '../destination/destination.types';

export enum UploadStatusEnum {
  'UPLOADED' = 'Uploaded',
  'MAPPING' = 'Mapping',
  'MAPPED' = 'Mapped',
  'REVIEWING' = 'Reviewing',
  'REVIEWED' = 'Reviewed',
  'CONFIRMED' = 'Confirmed',
  'PROCESSING' = 'Processing',
  'COMPLETED' = 'Completed',
  'TERMINATED' = 'Terminated',
}

export const SupportedFileMimeTypes = [
  'text/csv', // csv
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // EXCELX
  'application/vnd.ms-excel', // EXCEL
  'application/vnd.ms-excel.sheet.macroenabled.12', // EXCELM
];

export enum FileMimeTypesEnum {
  'CSV' = 'text/csv',
  'EXCEL' = 'application/vnd.ms-excel',
  'EXCELX' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'EXCELM' = 'application/vnd.ms-excel.sheet.macroenabled.12',
  'JSON' = 'application/json',
}

export enum FileEncodingsEnum {
  'CSV' = 'utf8',
  'EXCEL' = 'base64',
  'EXCELX' = 'base64',
  'JSON' = 'utf8',
}

export enum QueuesEnum {
  'SEND_WEBHOOK_DATA' = 'SEND_WEBHOOK_DATA',
  'SEND_BUBBLE_DATA' = 'SEND_BUBBLE_DATA',
  'END_IMPORT' = 'END_IMPORT',
}

export type SendWebhookCachedData = {
  page: number;
  email: string;
  callbackUrl: string;
  chunkSize: number;
  name: string; // template name
  extra?: string;
  authHeaderName: string;
  authHeaderValue: string;
  _templateId: string;
  allDataFilePath?: string;
  fileName: string;
  recordFormat?: string;
  chunkFormat?: string;
  defaultValues: string;
  multiSelectHeadings?: Record<string, string>;
};

export type SendBubbleCachedData = {
  name: string;
  page: number;
  email: string;
  datatype: string;
  environment: string;
  chunkSize: number;
  bubbleUrl: string;
  apiPrivateKey: string;
  _templateId: string;
  recordFormat: string;
  defaultValues: string;
  allDataFilePath?: string;
};

export type SendBubbleData = {
  uploadId: string;
  cache: SendBubbleCachedData;
};

export type SendWebhookData = {
  uploadId: string;
  cache?: SendWebhookCachedData;
};
export type PublishToQueueData = SendWebhookData;

export type EndImportData = {
  uploadId: string;
  destination: DestinationsEnum;
};

export interface IFileInformation {
  headings: string[];
  data: Record<string, unknown>[];
  totalRecords: number;
}

export interface IImportConfig {
  showBranding: boolean;
}
