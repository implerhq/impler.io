import { IInitPayload, IShowPayload } from '@impler/shared';
import { EventTypesEnum } from '@impler/shared';

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
  VALIDATE,
  UPLOAD,
  MAPPING,
  REVIEW,
  CONFIRMATION,
  COMPLETE,
}

export interface IFormvalues {
  templateId: string;
  file: File;
}

export interface IUploadValues extends IFormvalues {
  authHeaderValue?: string;
  extra?: string;
  schema?: string;
  output?: string;
}
