import { DestinationsEnum } from '@impler/shared';

export class DestinationResponseDto {
  destination?: DestinationsEnum;
  webhook?: {
    callbackUrl?: string;
    authHeaderName?: string;
    chunkSize?: number;
    retryInterval?: number;
    retryCount?: number;
  };
  bubbleio?: {
    bubbleAppUrl: string;
    apiPrivateKey: string;
    datatype: string;
  };
}
