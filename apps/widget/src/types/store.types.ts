import { ApiService } from '@impler/client';
import { IUpload } from '@impler/shared';

export interface IImplerStore {
  projectId: string;
  template?: string;
  accessToken?: string;
  extra?: string;
  authHeaderValue?: string;
}

export interface IApiStore {
  api: ApiService;
}

export interface IAppStore {
  uploadInfo: IUpload;
  reset: () => void;
  primaryColor: string;
  setUploadInfo: (uploadInfo: IUpload) => void;
}
