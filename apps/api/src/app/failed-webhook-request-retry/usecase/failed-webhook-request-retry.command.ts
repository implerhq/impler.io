export interface IFailedWebhookRetryRequestsCommand {
  _id?: string;
  _webhookLogId: string;
  _uploadId: string;
  error: any;
  dataContent?: Record<string, unknown>;
  retryInterval: number;
  retryCount: number;
  callbackUrl?: string;
  headers?: Record<string, any>;
  nextRequestTime?: Date;
  importName: string;
}
