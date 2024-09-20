import { UserRolesEnum } from '@impler/shared';
export class UpdateTeamMemberRoleCommand {
  userId: string;
  role: UserRolesEnum;
  projectId: string;
}
