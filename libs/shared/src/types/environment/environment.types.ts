export interface IApiKeyData {
  role: string;
  _userId: string;
  joinedOn?: string;
}

export interface IEnvironmentData {
  _id: string;
  _projectId: string;
  key: string;
  apiKeys: IApiKeyData[];
}
