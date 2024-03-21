import { SendWebhookCachedData } from '@impler/shared';

export interface ISendDataParameters {
  data: Record<string, unknown>;
  url: string;
  page: number;
  method: 'POST';
  uploadId: string;
  headers?: Record<string, string>;
}
export interface IBuildSendDataParameters {
  data: any[];
  page: number;
  chunkSize: number;
  template: string;
  uploadId: string;
  fileName: string;
  extra?: string;
  defaultValues: string;
  recordFormat?: string;
  chunkFormat?: string;
}
export interface IGetNextDataParameters extends SendWebhookCachedData {
  allData: any[];
}

export interface ISendDataResponse {
  statusCode: number;
  status: 'FAILED' | 'SUCCEED';
  failedReason?: string;
}
export interface ISendData {
  template: string;
  uploadId: string;
  data: any[];
  totalRecords: number;
  totalPages: number;
  page: number;
  pageSize: number;
  extra: string;
  fileName: string;
}
