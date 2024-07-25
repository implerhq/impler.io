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
  VALIDATE = 0,
  UPLOAD = 1,
  MAPPING = 2,
  REVIEW = 3,
  COMPLETE = 4,

  CONFIGURE = 1,
  MAPCOLUMNS = 2,
  SCHEDULE = 3,
  CONFIRM = 4,
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
}

export interface IAutoImportValues {
  url: string;
  templateId: string;
  authHeaderValue?: string;
  extra?: string;
  schema?: string;
  output?: string;
}
