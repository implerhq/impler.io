import { IUpload, EventTypesEnum, WIDGET_TEXTS, ColumnTypesEnum } from '@impler/shared';

export interface ISchemaItem {
  key: string;
  name: string;
  description?: string;
  alternateKeys?: string[];
  isRequired?: boolean;
  isUnique?: boolean;
  isFrozen?: boolean;
  defaultValue?: string | '<<null>>' | '<<undefined>>' | '<<>>' | '<<[]>>' | '<<true>>' | '<<false>>';
  selectValues?: string[];
  dateFormats?: string[];
  type?: ColumnTypesEnum;
  regex?: string;
  allowMultiSelect?: boolean;
}

export type UploadTemplateData = {
  uploadId: string;
  templateId: string;
};
export type UploadData = { uploadId: string };

export type EventCalls =
  | {
      type: EventTypesEnum.UPLOAD_STARTED;
      value: UploadTemplateData;
    }
  | {
      type: EventTypesEnum.UPLOAD_TERMINATED;
      value: UploadData;
    }
  | {
      type: EventTypesEnum.UPLOAD_COMPLETED;
      value: IUpload;
    }
  | {
      type: EventTypesEnum.DATA_IMPORTED;
      value: Record<string, any>[];
    }
  | {
      type: EventTypesEnum.CLOSE_WIDGET;
    }
  | {
      type: EventTypesEnum.WIDGET_READY;
    };

export interface ShowWidgetProps {
  colorScheme?: 'light' | 'dark';
  schema?: ISchemaItem[];
  data?: Record<string, string | any>[];
  output?: Record<string, string | any>;
  projectId: string;
  templateId: string;
  accessToken: string;
  texts?: CustomTexts;
  title?: string;
  primaryColor?: string;
  extra?: string | Record<string, any>;
  authHeaderValue?: string | (() => string) | (() => Promise<string>);
}

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type CustomTexts = DeepPartial<typeof WIDGET_TEXTS>;
