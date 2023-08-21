export class WebhookLogEntity {
  _id?: string;

  _uploadId: string;

  callDate: Date;

  status: string;

  error: any;

  failedReason: string;

  pageNumber: number;

  responseStatusCode: number;

  dataContent?: Record<string, unknown>;

  headersContent?: Record<string, unknown>;
}
