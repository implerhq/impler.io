import { Invite } from './invite/invite.usecase';
import { SentInvitations } from './sent-invitation/sent-invitation.usecase';
import { GetInvitation } from './get-invitation/get-invitation.usecase';
import { AcceptInvitation } from './accept-invitation/accept-invitation.usecase';
import { GenerateUniqueApiKey } from 'app/environment/usecases';
import { ListTeamMembers } from './list-team-members/list-team-members.usecase';
import { UpdateTeamMember } from './update-team-member-role/update-team-member.usecase';
import { DeleteTeamMember } from './delete-team-member/delete-team-member.usecase';
import { DeleteInvitation } from '../delete-invitation/delete-invitation.usecase';
import { DeclineInvitation } from './decline-invitation/decline-invitation.usecase';

export const USE_CASES = [
  Invite,
  SentInvitations,
  GetInvitation,
  AcceptInvitation,
  GenerateUniqueApiKey,
  ListTeamMembers,
  UpdateTeamMember,
  DeleteTeamMember,
  DeleteInvitation,
  DeclineInvitation,
  //
];
export {
  Invite,
  SentInvitations,
  GetInvitation,
  AcceptInvitation,
  GenerateUniqueApiKey,
  ListTeamMembers,
  UpdateTeamMember,
  DeleteTeamMember,
  DeleteInvitation,
  DeclineInvitation,
};
