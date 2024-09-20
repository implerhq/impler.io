export interface IApiKey {
  role: string;
  _userId: string;
  joinedOn?: string;
}

export class EnvironmentEntity {
  _id: string;

  _projectId: string;

  key: string;

  apiKeys: IApiKey[];
}
