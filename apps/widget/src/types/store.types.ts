import { ApiService } from '@impler/client';
import { IUpload, ITemplate } from '@impler/shared';

export interface IImplerStore {
  projectId: string;
  templateId?: string;
  accessToken?: string;
  extra?: string;
  authHeaderValue?: string;
}

export interface IApiStore {
  api: ApiService;
}

export interface IAppStore {
  templateInfo: ITemplate;
  uploadInfo: IUpload;
  reset: () => void;
  primaryColor: string;
  setTemplateInfo: (templateInfo: ITemplate) => void;
  setUploadInfo: (uploadInfo: IUpload) => void;
}
