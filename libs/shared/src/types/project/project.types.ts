export interface IProjectPayload {
  _id: string;
  name: string;
}

export enum UserRolesEnum {
  ADMIN = 'admin',
  TECH = 'tech',
  FINANCE = 'finance',
}
