import { WIDGET_TEXTS } from './config';
import { ButtonConfig } from './config/appearance.config';

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
export const ValidationTypes = {
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
  UPLOAD_SUCCESS: 'UPLOAD_SUCCESS',
  UPLOAD_ERROR: 'UPLOAD_ERROR',
  DATA_IMPORTED: 'DATA_IMPORTED',
  IMPORT_JOB_CREATED: 'IMPORT_JOB_CREATED',
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

export interface IUserJob {
  _id: string;
  url: string;
  _templateId: string;
  headings: string[];
  cron: string;
}

export enum ValidationTypesEnum {
  RANGE = 'range',
  LENGTH = 'length',
  UNIQUE_WITH = 'unique_with',
  DIGITS = 'digits',
}

export type RangeValidationType = {
  validate: 'range' | ValidationTypesEnum.RANGE;
  min?: number;
  max?: number;
  errorMessage?: string;
};

export type DigitsValidationType = {
  validate: 'digits' | ValidationTypesEnum.DIGITS;
  min: number;
  max: number;
  errorMessage?: string;
};
export type LengthValidationType = {
  validate: 'length' | ValidationTypesEnum.LENGTH;
  min?: number;
  max?: number;
  errorMessage?: string;
};

export type UniqueWithValidationType = {
  validate: 'unique_with' | ValidationTypesEnum.UNIQUE_WITH;
  uniqueKey: string;
  errorMessage?: string;
};

export type ValidationType =
  | RangeValidationType
  | LengthValidationType
  | UniqueWithValidationType
  | DigitsValidationType;

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
  type?: ValueOf<typeof ColumnTypes>;
  regex?: string;
  allowMultiSelect?: boolean;
  validations?: ValidationType[];
}

export type UploadTemplateData = {
  uploadId: string;
  templateId: string;
};
export type UploadData = { uploadId: string };
export type UploadSuccessData = { uploadId: string; rowCount: number };
export type UploadErrorData = { errorCode: number; errorMessage: string };

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
      type: typeof EventTypes.IMPORT_JOB_CREATED;
      value: IUserJob;
    }
  | {
      type: typeof EventTypes.UPLOAD_SUCCESS;
      value: UploadSuccessData;
    }
  | {
      type: typeof EventTypes.UPLOAD_ERROR;
      value: UploadErrorData;
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
  sampleFile?: File | Blob;
  texts?: CustomTexts;
  config?: WidgetConfig;
  appearance?: AppearanceConfig;
  maxRecords?: number;
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

export type ValueOf<T> = T[keyof T];

export declare type WidgetConfig = {
  hideFindAndReplaceButton?: boolean;
  hideDeleteButton?: boolean;
  hideCheckBox?: boolean;
  hideSrNo?: boolean;
  hideDownloadSampleButton?: boolean;
};

export declare type AppearanceConfig = {
  widget?: {
    backgroundColor?: string;
  };
  primaryColor?: string;
  fontFamily?: string;
  borderRadius?: string;
  primaryButtonConfig?: ButtonConfig;
  secondaryButtonConfig?: ButtonConfig;
};

export type CustomTexts = DeepPartial<typeof WIDGET_TEXTS>;

export interface IUseImplerProps {
  title?: string;
  texts?: CustomTexts;
  projectId?: string;
  templateId?: string;
  accessToken?: string;
  /**
   * @deprecated Use the `appearance.primaryColor` property instead.
   * In future versions, the `primaryColor` property will be moved under `appearance` object.
   */
  primaryColor?: string;
  /**
   * @deprecated Use the `extra` parameter in `showWidget()` instead.
   * Example: `showWidget({ extra: { your: 'data' } })`
   * In future versions, the `extra` property will be removed and `showWidget({ extra: { your: 'data' } })` will be the only way to pass extra data.
   */
  extra?: string | Record<string, any>;
  config?: WidgetConfig;
  appearance?: AppearanceConfig;
  maxRecords?: number;
  authHeaderValue?: string | (() => string) | (() => Promise<string>);
  onUploadStart?: (value: UploadTemplateData) => void;
  onUploadTerminate?: (value: UploadData) => void;
  onUploadComplete?: (value: IUpload) => void;
  onUploadSuccess?: (value: UploadSuccessData) => void;
  onDataImported?: (importedData: Record<string, any>[]) => void;
  onWidgetClose?: () => void;
  onImportJobCreated?: (jobInfo: IUserJob) => void;
  onWidgetReady?: () => void;
  onUploadError?: (error: UploadErrorData) => void;
}
