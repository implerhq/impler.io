export class ProjectInvitationEntity {
  _id: string;

  invitationEmails: string[];

  invitedOn: string;

  role: string;

  invitedBy: string;

  _projectId: string;

  token: string;
}
