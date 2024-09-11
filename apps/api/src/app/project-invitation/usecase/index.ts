import { ProjectInvitation } from './project-invitation/project-invitation.usecase';
import { SentProjectInvitations } from './sent-project-invitation/sent-project-invitation.usecase';
import { GetInvitation } from './accept-project-invitation/accept-project-invitation.usecase';

export const USE_CASES = [
  ProjectInvitation,
  SentProjectInvitations,
  GetInvitation,
  //
];
export { ProjectInvitation, SentProjectInvitations, GetInvitation };
