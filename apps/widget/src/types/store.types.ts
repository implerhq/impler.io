import { ApiService } from '@api';
import { Dispatch, SetStateAction } from 'react';
import { IUpload, WIDGET_TEXTS } from '@impler/client';
import { ITemplate, IImportConfig } from '@impler/shared';

export interface IImplerStore {
  projectId: string;
  templateId?: string;
  extra?: string;
  authHeaderValue?: string;
  setTemplateId: (templateId: string) => void;
}

export interface ITableStore {
  selectedRows: Set<number>;
}

export interface IApiStore {
  api: ApiService;
}

export enum FlowsEnum {
  AUTO_IMPORT = 'auto-import',
  STRAIGHT_IMPORT = 'straight',
  MANUAL_ENTRY = 'manual-entry',
  IMAGE_IMPORT = 'image-import',
}

export interface IAppStore {
  title?: string;
  texts: typeof WIDGET_TEXTS;
  importId?: string;
  imageSchema?: string;
  data?: string;
  templateInfo: ITemplate;
  uploadInfo: IUpload;
  reset: () => void;
  host: string;
  primaryColor: string;
  schema?: string;
  output?: string;
  flow: FlowsEnum;
  file?: File | Blob;
  showWidget: boolean;
  importConfig: IImportConfig;
  setFlow: (flow: FlowsEnum) => void;
  setImportId: (importId: string) => void;
  setShowWidget: (status: boolean) => void;
  setUploadInfo: (uploadInfo: IUpload) => void;
  setImageSchema: (imageSchema: string) => void;
  setTemplateInfo: (templateInfo: ITemplate) => void;
  setImportConfig: Dispatch<SetStateAction<IImportConfig>>;
}
