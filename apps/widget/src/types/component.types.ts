import { IInitPayload, IShowPayload } from '@impler/shared';
import { EventTypesEnum } from './event.types';

export type MessageHandlerDataType =
  | {
      type: EventTypesEnum.INIT_IFRAME;
      value: IInitPayload;
    }
  | {
      type: EventTypesEnum.SHOW_WIDGET;
      value: IShowPayload;
    };
