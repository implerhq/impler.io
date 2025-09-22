export class WebhookDestinationEntity {
  _id?: string;

  callbackUrl: string;

  authHeaderName: string;

  authHeaderValue: string;

  chunkSize: number;

  _templateId: string;

  retryInterval: number;

  retryCount: number;
}
