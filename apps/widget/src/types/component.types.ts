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

export enum PromptModalTypesEnum {
  'CLOSE' = 'CLOSE',
  'UPLOAD_AGAIN' = 'UPLOAD_AGAIN',
}

export enum PhasesEum {
  UPLOAD,
  MAPPING,
  REVIEW,
  CONFIRMATION,
  COMPLETE,
}

export interface IFormvalues {
  template: string;
  file: File;
}

export interface IUploadValues extends IFormvalues {
  authHeaderValue?: string;
  extra?: string;
}
