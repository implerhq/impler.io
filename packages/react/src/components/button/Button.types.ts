import { IUpload } from '@impler/shared';

export interface ButtonProps {
  projectId: string;
  accessToken?: string;
  template?: string;
  authHeaderValue?: string | (() => string) | (() => Promise<string>);
  extra?: string | Record<string, any>;
  children?: React.ReactNode;
  className?: string;
  primaryColor?: string;
  onUploadStart?: (value: UploadTemplateData) => void;
  onUploadTerminate?: (value: UploadData) => void;
  onUploadComplete?: (value: IUpload) => void;
}

export type UploadTemplateData = {
  uploadId: string;
  templateId: string;
};
export type UploadData = { uploadId: string };

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
    };
