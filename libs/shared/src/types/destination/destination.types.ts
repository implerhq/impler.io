export enum DestinationsEnum {
  'WEBHOOK' = 'webhook',
  'BUBBLEIO' = 'bubbleIo',
  'FRONTEND' = 'frontend',
}

export enum BubbleDestinationEnvironmentEnum {
  'DEVELOPMENT' = 'development',
  'LIVE' = 'live',
}

export interface IWebhookData {
  callbackUrl: string;
  authHeaderName: string;
  chunkSize: number;
  retryInterval?: number;
  retryCount?: number;
}

export interface IBubbleData {
  appName: string;
  customDomainName?: string;
  environment: string;
  apiPrivateKey: string;
  datatype: string;
}

export interface IDestinationData {
  destination?: DestinationsEnum;
  webhook?: IWebhookData;
  bubbleIo?: IBubbleData;
}
