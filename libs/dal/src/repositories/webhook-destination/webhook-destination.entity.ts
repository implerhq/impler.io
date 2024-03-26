export class WebhookDestinationEntity {
  _id?: string;

  callbackUrl: string;

  authHeaderName: string;

  chunkSize: number;

  _templateId: string;
}
