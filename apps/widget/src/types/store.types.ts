import { ApiService } from '@impler/client';
import { IUpload, ITemplate, IImportConfig } from '@impler/shared';

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

export interface IAppStore {
  title?: string;
  importId?: string;
  imageSchema?: string;
  data?: Record<string, string | number>[];
  templateInfo: ITemplate;
  uploadInfo: IUpload;
  reset: () => void;
  host: string;
  primaryColor: string;
  schema?: string;
  output?: string;
  showWidget: boolean;
  importConfig: IImportConfig;
  setImportId: (importId: string) => void;
  setShowWidget: (status: boolean) => void;
  setUploadInfo: (uploadInfo: IUpload) => void;
  setImageSchema: (imageSchema: string) => void;
  setTemplateInfo: (templateInfo: ITemplate) => void;
  setImportConfig: (importConfig: IImportConfig) => void;
}
