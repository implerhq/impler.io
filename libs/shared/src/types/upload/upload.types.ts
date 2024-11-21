import { DestinationsEnum } from '../destination/destination.types';

export enum UploadStatusEnum {
  'UPLOADED' = 'Uploaded',
  'MAPPING' = 'Mapping',
  'MAPPED' = 'Mapped',
  'SELECT_HEADER' = 'Select Header',
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
  'XML' = 'application/rss+xml',
  'TEXTXML' = 'text/xml',
  'PNG' = 'image/png',
  'JPG' = 'image/jpeg',
  'JPEG' = 'image/jpeg',
  'WEBP' = 'image/webp',
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
  'GET_IMPORT_JOB_DATA' = 'GET_IMPORT_JOB_DATA',
  'SEND_IMPORT_JOB_DATA' = 'SEND_IMPORT_JOB_DATA',
}

export type CommonCachedData = {
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
  recordFormat?: string;
  chunkFormat?: string;
  defaultValues: string;
  multiSelectHeadings?: Record<string, string>;
  imageHeadings?: string[];
};

export type SendWebhookCachedData = {
  fileName: string;
} & CommonCachedData;

export type SendImportJobCachedData = CommonCachedData;

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

export type SendImportJobData = {
  _jobId: string;
  allDataFilePath: string;
  cache?: SendImportJobCachedData;
};

export type SendRSSXMLData = {
  _jobId: string;
};
export type PublishToQueueData = SendWebhookData;

export type EndImportData = {
  uploadId: string;
  uploadedFileId?: string;
  destination: DestinationsEnum;
};

export interface IFileInformation {
  headings: string[];
  data: Record<string, unknown>[];
  totalRecords: number;
}

export interface IImportConfig {
  showBranding: boolean;
  mode: string;
  title: string;
}
