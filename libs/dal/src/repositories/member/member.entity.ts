import { MemberRoleEnum, MemberStatusEnum, IMemberInvite } from '@impler/shared';
import { UserEntity } from '../user';

export class MemberEntity {
  _id: string;

  _userId: string;

  user?: Pick<UserEntity, 'firstName' | '_id' | 'lastName' | 'email'>;

  role: MemberRoleEnum;

  memberStatus: MemberStatusEnum;

  _projectId: string;

  invite: IMemberInvite;
}
