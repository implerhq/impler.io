export interface IBaseSendDataParameters {
  data: any[];
  page: number;
  chunkSize: number;
  defaultValues: string;
  totalRecords: number;
  recordFormat?: string;
}
export interface IBuildSendDataParameters extends IBaseSendDataParameters {
  template: string;
  uploadId: string;
  fileName: string;
  extra?: string;
  defaultValues: string;
  recordFormat?: string;
  chunkFormat?: string;
  multiSelectHeadings?: Record<string, string>;
  imageHeadings?: string[];
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
