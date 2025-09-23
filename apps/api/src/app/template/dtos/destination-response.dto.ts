import { DestinationsEnum } from '@impler/shared';

export class DestinationResponseDto {
  destination?: DestinationsEnum;
  webhook?: {
    callbackUrl?: string;
    authHeaderName?: string;
    authHeaderValue?: string;
    chunkSize?: number;
    retryInterval?: number;
    retryCount?: number;
  };
  bubbleio?: {
    bubbleAppUrl: string;
    apiPrivateKey: string;
  };
}
