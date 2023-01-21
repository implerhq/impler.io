import { ProcessFileCachedData } from '@impler/shared';

export interface ISendDataParameters {
  data: ISendData;
  url: string;
  method: 'POST';
}
export interface IBuildSendDataParameters {
  data: any[];
  page: number;
  chunkSize: number;
  isInvalidRecords: boolean;
  template: string;
  uploadId: string;
  fileName: string;
  extra?: string;
}
export interface IGetNextDataParameters extends ProcessFileCachedData {
  validData: any[];
  invalidData: any[];
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
  isInvalidRecords: boolean;
  fileName: string;
}
