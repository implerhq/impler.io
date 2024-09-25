import { UserRolesEnum } from '@impler/shared';
export class UpdateTeamMemberCommand {
  userId: string;
  role: UserRolesEnum;
  projectId: string;
}
