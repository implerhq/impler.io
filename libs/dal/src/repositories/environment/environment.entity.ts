export interface IApiKey {
  key: string;
  _userId: string;
}

export class EnvironmentEntity {
  _id: string;

  _projectId: string;

  apiKeys: IApiKey[];
}
