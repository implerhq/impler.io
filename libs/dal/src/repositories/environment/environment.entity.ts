export interface IApiKey {
  _id: string;
  role: string;
  _userId: string;
  joinedOn?: string;
  isOwner?: boolean;
}

export class EnvironmentEntity {
  _id: string;

  _projectId: string;

  key: string;

  apiKeys: IApiKey[];
}
