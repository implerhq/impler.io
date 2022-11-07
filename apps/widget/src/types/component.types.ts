import { IInitPayload, IShowPayload } from '@impler/shared';

export type MessageHandlerDataType =
  | {
      type: 'INIT_IFRAME';
      value: IInitPayload;
    }
  | {
      type: 'SHOW_WIDGET';
      value: IShowPayload;
    };
