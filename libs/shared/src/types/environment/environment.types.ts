export interface IApiKeyData {
  role: UserRoleEnum;
  _userId: string;
}

export interface IEnvironmentData {
  _id: string;
  _projectId: string;
  key: string;
  apiKeys: IApiKeyData[];
}

export enum UserRoleEnum {
  ADMIN = 'Admin',
  TECH = 'Tech',
  FINANCE = 'Finance',
}
