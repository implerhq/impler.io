import {
  IUpload,
  EventTypesEnum,
  WIDGET_TEXTS,
  ColumnTypesEnum,
} from '@impler/shared';

export interface ISchemaItem {
  key: string;
  name: string;
  description?: string;
  alternateKeys?: string[];
  isRequired?: boolean;
  isUnique?: boolean;
  isFrozen?: boolean;
  defaultValue?:
    | string
    | '<<null>>'
    | '<<undefined>>'
    | '<<>>'
    | '<<[]>>'
    | '<<true>>'
    | '<<false>>';
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
      type: typeof EventTypesEnum.UPLOAD_STARTED;
      value: UploadTemplateData;
    }
  | {
      type: typeof EventTypesEnum.UPLOAD_TERMINATED;
      value: UploadData;
    }
  | {
      type: typeof EventTypesEnum.UPLOAD_COMPLETED;
      value: IUpload;
    }
  | {
      type: typeof EventTypesEnum.DATA_IMPORTED;
      value: Record<string, any>[];
    }
  | {
      type: typeof EventTypesEnum.CLOSE_WIDGET;
    }
  | {
      type: typeof EventTypesEnum.WIDGET_READY;
    };

export interface IShowWidgetProps {
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

export interface IUseImplerProps {
  title?: string;
  texts?: CustomTexts;
  projectId?: string;
  templateId?: string;
  accessToken?: string;
  primaryColor?: string;
  extra?: string | Record<string, any>;
  authHeaderValue?: string | (() => string) | (() => Promise<string>);
  onUploadStart?: (value: UploadTemplateData) => void;
  onUploadTerminate?: (value: UploadData) => void;
  onUploadComplete?: (value: IUpload) => void;
  onDataImported?: (importedData: Record<string, any>[]) => void;
  onWidgetClose?: () => void;
}
