import { IUpload, EventTypesEnum } from '@impler/shared';

export interface ButtonProps {
  projectId: string;
  accessToken?: string;
  templateId?: string;
  authHeaderValue?: string | (() => string) | (() => Promise<string>);
  extra?: string | Record<string, any>;
  children?: React.ReactNode;
  className?: string;
  primaryColor?: string;
  onUploadStart?: (value: UploadTemplateData) => void;
  onUploadTerminate?: (value: UploadData) => void;
  onUploadComplete?: (value: IUpload) => void;
  onWidgetClose?: () => void;
}

export interface ISchemaItem {
  key: string;
  name: string;
  description: string;
  alternateKeys?: string[];
  isRequired?: boolean;
  isUnique?: boolean;
  isFrozen?: boolean;
  defaultValue?: string | '<<null>>' | '<<undefined>>' | '<<>>' | '<<[]>>' | '<<true>>' | '<<false>>';
  selectValues?: string[];
  dateFormats?: string[];
  type?: 'String' | 'Number' | 'Double' | 'Date' | 'Email' | 'Regex' | 'Select' | 'Any' | 'Image';
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
}

export interface UseImplerProps {
  title?: string;
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
