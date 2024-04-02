import { DestinationsEnum } from '@impler/shared';

export class DestinationResponseDto {
  destination?: DestinationsEnum;
  webhook?: {
    callbackUrl?: string;
    authHeaderName?: string;
    chunkSize?: number;
  };
  bubbleio?: {
    appName: string;
    apiPrivateKey: string;
    datatype: string;
    environment: string;
    customDomainName?: string;
  };
}
