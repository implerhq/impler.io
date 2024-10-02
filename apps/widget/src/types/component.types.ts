import { IUserShowPayload } from '@impler/shared';
import { EventTypesEnum, WidgetEventTypesEnum } from '@impler/shared';

export type MessageHandlerDataType =
  | {
      type: EventTypesEnum.INIT_IFRAME;
    }
  | {
      type: WidgetEventTypesEnum.SHOW_WIDGET;
      value: IUserShowPayload;
    }
  | {
      type: WidgetEventTypesEnum.CLOSE_WIDGET;
    };

export enum PromptModalTypesEnum {
  'CLOSE' = 'CLOSE',
  'UPLOAD_AGAIN' = 'UPLOAD_AGAIN',
}

export enum PhasesEnum {
  VALIDATE = 0,

  IMAGE_UPLOAD = 1,
  UPLOAD = 2,
  MAPPING = 3,
  REVIEW = 4,
  COMPLETE = 5,

  CONFIGURE = 1,
  MAPCOLUMNS = 2,
  SCHEDULE = 3,
  CONFIRM = 4,

  MANUAL_ENTRY = 1,
  SUBMIT = 2,
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

export interface IAutoImportValues {
  url: string;
  templateId: string;
  authHeaderValue?: string;
  extra?: string;
  schema?: string;
  output?: string;
}
