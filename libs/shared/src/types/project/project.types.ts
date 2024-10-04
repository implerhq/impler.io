export interface IProjectPayload {
  _id: string;
  name: string;
  isOwner: boolean;
  role: UserRolesEnum;
}

export enum UserRolesEnum {
  ADMIN = 'Admin',
  TECH = 'Tech',
  FINANCE = 'Finance',
}
