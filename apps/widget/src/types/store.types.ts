import { ApiService } from '@impler/client';
import { IUpload, ITemplate, IImportConfig } from '@impler/shared';

export interface IImplerStore {
  projectId: string;
  templateId?: string;
  extra?: string;
  authHeaderValue?: string;
}

export interface IApiStore {
  api: ApiService;
}

export interface IAppStore {
  title?: string;
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
  setShowWidget: (status: boolean) => void;
  setUploadInfo: (uploadInfo: IUpload) => void;
  setTemplateInfo: (templateInfo: ITemplate) => void;
  setImportConfig: (importConfig: IImportConfig) => void;
}
