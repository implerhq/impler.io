export class FailedWebhookRetryRequestsEntity {
  _id: string;

  _webhookLogId: string;

  _uploadId: string;

  dataContent?: Record<string, unknown>;

  retryInterval: number;

  retryCount: number;

  nextRequestTime: Date;

  error: any;

  importName: string;
}
