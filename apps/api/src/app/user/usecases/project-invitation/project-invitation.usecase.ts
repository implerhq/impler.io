import { EmailService } from '@impler/services';
import { constructQueryString, EMAIL_SUBJECT } from '@impler/shared';
import { ProjectInvitationCommand } from './project-invitation.command';
import { randomBytes } from 'crypto';
import { ProjectInvitationRepository } from '@impler/dal';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectInvitation {
  constructor(
    private emailService: EmailService,
    private projectInvitationRepository: ProjectInvitationRepository
  ) {}

  async exec(command: ProjectInvitationCommand) {
    for (const invitationEmail of command.invitationEmails) {
      const invitation = await this.projectInvitationRepository.create({
        invitationToEmail: invitationEmail,
        invitedOn: new Date().toDateString(),
        role: command.role,
        invitedBy: command.invitatedBy,
        _projectId: command.projectId,
        token: randomBytes(16).toString('hex'),
      });

      let invitationUrl = `${process.env.WEB_BASE_URL}/auth/signup`;
      invitationUrl += constructQueryString({
        invitationId: invitation._id,
        token: invitation.token,
      });

      if (this.emailService.isConnected()) {
        const emailContents = this.emailService.getEmailContent({
          type: 'PROJECT_INVITATION_EMAIL',
          data: {
            projectName: command.projectName,
            invitationId: invitation._id,
            invitationUrl,
            invitedBy: command.invitatedBy,
            token: invitation.token,
            userName: command.userName,
          },
        });
        await this.emailService.sendEmail({
          to: invitationEmail,
          subject: EMAIL_SUBJECT.PROJECT_INVITATION,
          html: emailContents,
          from: process.env.EMAIL_FROM,
          senderName: command.userName,
        });
      }
    }
  }
}
