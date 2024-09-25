export interface IProjectPayload {
  _id: string;
  name: string;
}

export enum UserRolesEnum {
  ADMIN = 'Admin',
  TECH = 'Tech',
  FINANCE = 'Finance',
}
