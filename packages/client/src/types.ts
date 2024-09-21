import { WIDGET_TEXTS } from './config';

// used for export
export const ColumnTypes = {
  STRING: 'String',
  NUMBER: 'Number',
  DATE: 'Date',
  EMAIL: 'Email',
  REGEX: 'Regex',
  SELECT: 'Select',
  ANY: 'Any',
  DOUBLE: 'Double',
  IMAGE: 'Image',
} as const;

// used for export
export const ValidatorTypes = {
  RANGE: 'range',
  LENGTH: 'length',
  UNIQUE_WITH: 'unique_with',
} as const;

// used for export
export const EventTypes = {
  INIT_IFRAME: 'INIT_IFRAME',
  WIDGET_READY: 'WIDGET_READY',
  CLOSE_WIDGET: 'CLOSE_WIDGET',
  AUTHENTICATION_VALID: 'AUTHENTICATION_VALID',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  UPLOAD_STARTED: 'UPLOAD_STARTED',
  UPLOAD_TERMINATED: 'UPLOAD_TERMINATED',
  UPLOAD_COMPLETED: 'UPLOAD_COMPLETED',
  DATA_IMPORTED: 'DATA_IMPORTED',
} as const;

export interface IUpload {
  _id: string;
  _templateId: string;
  _uploadedFileId: string;
  _allDataFileId: string;
  _validDataFileId: string;
  _invalidDataFileId: string;
  invalidCSVDataFileUrl: string;
  originalFileName: string;
  originalFileType: string;
  headings: string[];
  uploadedDate: Date;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  authHeaderValue: string;
  status: string;
  extra: string;
  __v: number;
  processInvalidRecords: boolean;
  customRecordFormat: string;
  customChunkFormat: string;
}

export enum ValidatorTypesEnum {
  RANGE = 'range',
  LENGTH = 'length',
  UNIQUE_WITH = 'unique_with',
}

export type RangeValidatorType = {
  validate: 'range' | ValidatorTypesEnum.RANGE;
  min?: number;
  max?: number;
  errorMessage?: string;
};

export type LengthValidatorType = {
  validate: 'length' | ValidatorTypesEnum.LENGTH;
  min?: number;
  max?: number;
  errorMessage?: string;
};

export type UniqueWithValidatorType = {
  validate: 'unique_with' | ValidatorTypesEnum.UNIQUE_WITH;
  uniqueKey: string;
  errorMessage?: string;
};

export type ValidatorType =
  | RangeValidatorType
  | LengthValidatorType
  | UniqueWithValidatorType;

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
  type?: keyof typeof ColumnTypes;
  regex?: string;
  allowMultiSelect?: boolean;
  validators?: ValidatorType[];
}

export type UploadTemplateData = {
  uploadId: string;
  templateId: string;
};
export type UploadData = { uploadId: string };

export type EventCalls =
  | {
      type: typeof EventTypes.UPLOAD_STARTED;
      value: UploadTemplateData;
    }
  | {
      type: typeof EventTypes.UPLOAD_TERMINATED;
      value: UploadData;
    }
  | {
      type: typeof EventTypes.UPLOAD_COMPLETED;
      value: IUpload;
    }
  | {
      type: typeof EventTypes.DATA_IMPORTED;
      value: Record<string, any>[];
    }
  | {
      type: typeof EventTypes.CLOSE_WIDGET;
    }
  | {
      type: typeof EventTypes.WIDGET_READY;
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
