export interface IApiKeyData {
  key: string;
  _userId: string;
}

export interface IEnvironmentData {
  _id: string;
  _projectId: string;
  apiKeys: IApiKeyData[];
}
