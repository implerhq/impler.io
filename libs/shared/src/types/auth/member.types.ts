export enum MemberRoleEnum {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum MemberStatusEnum {
  ACTIVE = 'active',
  INVITED = 'invited',
}

export interface IMemberInvite {
  email: string;
  invitationDate: Date;
  answerDate?: Date;
  _inviterId: string;
}

export const AllowedEditProjectRoles = [MemberRoleEnum.ADMIN];
