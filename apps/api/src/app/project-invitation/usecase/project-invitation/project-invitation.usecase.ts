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
    for (const invitationEmailTo of command.invitationEmailsTo) {
      const invitation = await this.projectInvitationRepository.create({
        invitationToEmail: invitationEmailTo,
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
            invitedBy: command.invitatedBy,
            projectName: command.projectName,
            invitationUrl,
          },
        });
        await this.emailService.sendEmail({
          to: invitationEmailTo,
          subject: `${EMAIL_SUBJECT.PROJECT_INVITATION} ${command.projectName}`,
          html: emailContents,
          from: process.env.EMAIL_FROM,
          senderName: command.userName,
        });
      }
    }
  }
}
