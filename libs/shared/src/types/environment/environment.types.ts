export interface IApiKeyData {
  role: string;
  _userId: string;
}

export interface IEnvironmentData {
  _id: string;
  _projectId: string;
  key: string;
  apiKeys: IApiKeyData[];
}
