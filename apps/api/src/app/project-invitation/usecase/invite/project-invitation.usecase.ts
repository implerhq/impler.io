import { randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import { EmailService } from '@impler/services';
import { constructQueryString, EMAIL_SUBJECT } from '@impler/shared';
import { ProjectInvitationRepository, UserRepository } from '@impler/dal';

import { InviteCommand } from './project-invitation.command';

@Injectable()
export class Invite {
  constructor(
    private emailService: EmailService,
    private userRepository: UserRepository,
    private projectInvitationRepository: ProjectInvitationRepository
  ) {}

  async exec(command: InviteCommand) {
    const users = await this.userRepository.find(
      {
        email: {
          $in: command.invitationEmailsTo,
        },
      },
      'email'
    );
    const signedUpUsers = users.reduce((list: Set<string>, user) => {
      list.add(user.email);

      return list;
    }, new Set<string>());
    for (const invitationEmailTo of command.invitationEmailsTo) {
      const invitation = await this.projectInvitationRepository.create({
        invitationToEmail: invitationEmailTo,
        invitedOn: new Date().toDateString(),
        role: command.role,
        invitedBy: command.invitatedBy,
        _projectId: command.projectId,
        token: randomBytes(16).toString('hex'),
      });

      let invitationUrl = signedUpUsers.has(invitationEmailTo)
        ? `${process.env.WEB_BASE_URL}/team-members`
        : `${process.env.WEB_BASE_URL}/auth/signup`;
      invitationUrl += constructQueryString({
        invitationId: invitation._id,
        token: invitation.token,
      });

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
        senderName: process.env.EMAIL_FROM_NAME,
      });
    }
  }
}
