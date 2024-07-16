export interface IShowPayload {
  host: string;
  extra?: string;
  templateId?: string;
  authHeaderValue?: string;
  primaryColor?: string;
  colorScheme?: string;
  title?: string;
  schema?: string;
  data?: Record<string, string | any>[];
  output?: string;
  projectId: string;
  accessToken: string;
  uuid: string;
}
export interface IOption {
  value: string;
  label: string;
}
export enum EventTypesEnum {
  INIT_IFRAME = 'INIT_IFRAME',
  SHOW_WIDGET = 'SHOW_WIDGET',
  WIDGET_READY = 'WIDGET_READY',
  CLOSE_WIDGET = 'CLOSE_WIDGET',
  AUTHENTICATION_VALID = 'AUTHENTICATION_VALID',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  UPLOAD_STARTED = 'UPLOAD_STARTED',
  UPLOAD_TERMINATED = 'UPLOAD_TERMINATED',
  UPLOAD_COMPLETED = 'UPLOAD_COMPLETED',
  DATA_IMPORTED = 'DATA_IMPORTED',
}
