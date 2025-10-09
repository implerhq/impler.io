import { AppearanceConfig, WIDGET_TEXTS, WidgetConfig } from '@impler/client';
import { ISchemaItem } from '../column';

export interface IImportConfig {
  showBranding: boolean;
  mode: string;
  title: string;
  IMAGE_IMPORT?: boolean;
  IMPORTED_ROWS?: Array<{
    flat_fee: number;
    per_unit: number;
    last_unit: number | string;
    first_unit: number;
  }>;
  REMOVE_BRANDING?: boolean;
  AUTOMATIC_IMPORTS?: boolean;
  ADVANCED_VALIDATORS?: boolean;
  FREEZE_COLUMNS?: boolean;
  TEAM_MEMBERS?: number;
  ROWS?: number;
  MANUAL_ENTRY?: boolean;
}

export interface ICommonShowPayload {
  host: string;
  extra?: string | any;
  templateId?: string;
  authHeaderValue?: string;
  primaryColor?: string;
  maxRecords?: number;
  appearance?: AppearanceConfig;
  colorScheme?: string;
  title?: string;
  sampleFile?: File | Blob;
  projectId: string;
  accessToken: string;
  uuid: string;
}
export interface IWidgetShowPayload extends ICommonShowPayload {
  texts?: typeof WIDGET_TEXTS;
  config?: WidgetConfig;
  data?: string;
  schema?: string;
  output?: string;
}

export interface IUserShowPayload extends ICommonShowPayload {
  texts?: string | typeof WIDGET_TEXTS;
  config?: WidgetConfig;
  data?: string | Record<string, string | number>[];
  schema?: string | ISchemaItem[];
  output?: string | Record<string, string | number>;
}

export interface IOption {
  value: string;
  label: string;
}
export enum EventTypesEnum {
  INIT_IFRAME = 'INIT_IFRAME',
  WIDGET_READY = 'WIDGET_READY',
  CLOSE_WIDGET = 'CLOSE_WIDGET',
  AUTHENTICATION_VALID = 'AUTHENTICATION_VALID',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  UPLOAD_STARTED = 'UPLOAD_STARTED',
  UPLOAD_TERMINATED = 'UPLOAD_TERMINATED',
  UPLOAD_COMPLETED = 'UPLOAD_COMPLETED',
  DATA_IMPORTED = 'DATA_IMPORTED',
  IMPORT_JOB_CREATED = 'IMPORT_JOB_CREATED',
}

export enum WidgetEventTypesEnum {
  SHOW_WIDGET = 'SHOW_WIDGET',
  CLOSE_WIDGET = 'CLOSE_WIDGET',
}
