export interface IProjectPayload {
  _id: string;
  name: string;
  isOwner: boolean;
}

export enum UserRolesEnum {
  ADMIN = 'Admin',
  TECH = 'Tech',
  FINANCE = 'Finance',
}
