export class ProjectInvitationCommand {
  projectName: string;
  projectId: string;
  invitatedBy: string;
  invitationEmailsTo: string[];
  role: string;
  userName: string;
}
