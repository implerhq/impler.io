import { IShowPayload } from '@impler/shared';
import { EventTypesEnum, WidgetEventTypesEnum } from '@impler/shared';

export type MessageHandlerDataType =
  | {
      type: EventTypesEnum.INIT_IFRAME;
    }
  | {
      type: WidgetEventTypesEnum.SHOW_WIDGET;
      value: IShowPayload;
    }
  | {
      type: WidgetEventTypesEnum.CLOSE_WIDGET;
    };

export enum PromptModalTypesEnum {
  'CLOSE' = 'CLOSE',
  'UPLOAD_AGAIN' = 'UPLOAD_AGAIN',
}

export enum PhasesEnum {
  VALIDATE,
  IMAGE_UPLOAD,
  UPLOAD,
  MAPPING,
  REVIEW,
  CONFIRMATION,
  COMPLETE,
}

export interface IFormvalues {
  file: File;
  templateId: string;
  selectedSheetName?: string;
}

export interface IUploadValues extends IFormvalues {
  authHeaderValue?: string;
  extra?: string;
  schema?: string;
  output?: string;
  importId?: string;
  imageSchema?: string;
}
