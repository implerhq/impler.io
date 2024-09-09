export class ProjectInvitationCommand {
  projectName: string;
  projectId: string;
  invitatedBy: string;
  invitationEmails: string[];
  role: string;
  userName: string;
}
