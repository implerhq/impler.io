export enum DestinationsEnum {
  'WEBHOOK' = 'webhook',
  'BUBBLEIO' = 'bubbleIo',
}

export enum BubbleDestinationEnvironmentEnum {
  'DEVELOPMENT' = 'development',
  'LIVE' = 'live',
}

export interface IWebhookData {
  callbackUrl: string;
  authHeaderName: string;
  chunkSize: number;
}

export interface IBubbleData {
  appName: string;
  customDomainName?: string;
  environment: string;
  apiPrivateKey: string;
  datatype: string;
}
