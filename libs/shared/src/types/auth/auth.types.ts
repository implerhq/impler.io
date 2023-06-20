export enum AuthProviderEnum {
  'GOOGLE' = 'google',
  'GITHUB' = 'github',
}

export interface IJwtPayload {
  _id: string;
  _projectId?: string;
  role?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

export interface ILoginResponse {
  token: string;
  showAddProject?: boolean;
}
