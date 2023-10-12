export interface IInitPayload {
  accessToken?: string;
}
export interface IShowPayload {
  extra?: string;
  templateId?: string;
  authHeaderValue?: string;
  primaryColor?: string;
  colorScheme?: string;
  title?: string;
  schema?: string;
  data?: Record<string, string | any>[];
  output?: string;
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
}
