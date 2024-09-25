import { randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import { EmailService } from '@impler/services';
import { EMAIL_SUBJECT } from '@impler/shared';
import { ProjectInvitationRepository } from '@impler/dal';

import { InviteCommand } from './project-invitation.command';

@Injectable()
export class Invite {
  constructor(
    private emailService: EmailService,
    private projectInvitationRepository: ProjectInvitationRepository
  ) {}

  async exec(command: InviteCommand) {
    for (const invitationEmailTo of command.invitationEmailsTo) {
      const invitation = await this.projectInvitationRepository.create({
        invitationToEmail: invitationEmailTo,
        invitedOn: new Date().toDateString(),
        role: command.role,
        invitedBy: command.invitatedBy,
        _projectId: command.projectId,
        token: randomBytes(16).toString('hex'),
      });

      const emailContents = this.emailService.getEmailContent({
        type: 'PROJECT_INVITATION_EMAIL',
        data: {
          invitedBy: command.invitatedBy,
          projectName: command.projectName,
          invitationUrl: `${process.env.WEB_BASE_URL}/auth/invitation/${invitation._id}`,
        },
      });
      await this.emailService.sendEmail({
        to: invitationEmailTo,
        subject: `${EMAIL_SUBJECT.PROJECT_INVITATION} ${command.projectName}`,
        html: emailContents,
        from: process.env.EMAIL_FROM,
        senderName: process.env.EMAIL_FROM_NAME,
      });
    }
  }
}
