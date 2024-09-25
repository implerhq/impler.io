import { Invite } from './invite/project-invitation.usecase';
import { SentProjectInvitations } from './sent-project-invitation/sent-project-invitation.usecase';
import { GetProjectInvitation } from './get-project-invitation/get-project-invitation.usecase';
import { AcceptProjectInvitation } from './accept-project-invitation//accept-project-invitation.usecase';
import { GenerateUniqueApiKey } from 'app/environment/usecases';
import { ListTeamMembers } from './list-team-members/list-team-members.usecase';
import { UpdateTeamMemberRole } from './update-team-member-role/update-team-member.usecase';
import { DeleteTeamMember } from './delete-team-member/delete-team-member.usecase';
import { DeleteInvitation } from '../delete-invitation/delete-invitation.usecase';
import { DeclineInvitation } from './decline-project-invitation/decline-project-invitation.usecase';

export const USE_CASES = [
  Invite,
  SentProjectInvitations,
  GetProjectInvitation,
  AcceptProjectInvitation,
  GenerateUniqueApiKey,
  ListTeamMembers,
  UpdateTeamMemberRole,
  DeleteTeamMember,
  DeleteInvitation,
  DeclineInvitation,
  //
];
export {
  Invite,
  SentProjectInvitations,
  GetProjectInvitation,
  AcceptProjectInvitation,
  GenerateUniqueApiKey,
  ListTeamMembers,
  UpdateTeamMemberRole,
  DeleteTeamMember,
  DeleteInvitation,
  DeclineInvitation,
};
