export interface IProjectPayload {
  _id: string;
  name: string;
  isOwner: boolean;
  role: UserRolesEnum;
  importName: string;
  onboarding?: boolean;
  authDomains?: string[];
}

export enum UserRolesEnum {
  ADMIN = 'Admin',
  TECH = 'Tech',
  FINANCE = 'Finance',
}
