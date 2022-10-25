import { ApiService } from '../client';

export interface IImplerStore {
  projectId: string;
  template: string;
  accessToken?: string;
  extra?: string;
  authHeaderValue?: string;
}

export interface IApiStore {
  api: ApiService;
}
