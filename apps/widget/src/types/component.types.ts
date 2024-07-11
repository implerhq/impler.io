import { IShowPayload } from '@impler/shared';
import { EventTypesEnum } from '@impler/shared';

export type MessageHandlerDataType =
  | {
      type: EventTypesEnum.INIT_IFRAME;
    }
  | {
      type: EventTypesEnum.SHOW_WIDGET;
      value: IShowPayload;
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
  CONFORM = 4,
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
