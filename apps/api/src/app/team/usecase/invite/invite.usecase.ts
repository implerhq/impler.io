import { randomBytes } from 'crypto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { EmailService } from '@impler/services';
import { EMAIL_SUBJECT } from '@impler/shared';
import { ProjectInvitationRepository, EnvironmentRepository } from '@impler/dal';

import { InviteCommand } from './invite.command';

@Injectable()
export class Invite {
  constructor(
    private emailService: EmailService,
    private projectInvitationRepository: ProjectInvitationRepository,
    private environmentRepository: EnvironmentRepository
  ) {}

  async exec(command: InviteCommand) {
    const existingInvitationsCount = await this.projectInvitationRepository.count({
      _projectId: command.projectId,
      invitedBy: command.invitatedBy,
    });

    const totalInvitationsCount = existingInvitationsCount + command.invitationEmailsTo.length;
    if (totalInvitationsCount > 4) {
      throw new BadRequestException(
        'You cannot invite more than 4 emails at a time, including already sent invitations.'
      );
    }

    const teamMembers = await this.environmentRepository.getProjectTeamMembers(command.projectId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const memberEmails = teamMembers.map((teamMember) => teamMember._userId.email);

    for (const invitationEmailTo of command.invitationEmailsTo) {
      if (memberEmails.includes(invitationEmailTo)) {
        throw new BadRequestException(`The email ${invitationEmailTo} is already a member of the project.`);
      }

      const existingInvitation = await this.projectInvitationRepository.findOne({
        invitationToEmail: invitationEmailTo,
        _projectId: command.projectId,
      });

      if (existingInvitation) {
        throw new BadRequestException(`The email ${invitationEmailTo} has already been invited.`);
      }

      const teamMember = await this.environmentRepository.getProjectTeamMembers(command.projectId);
      if (teamMember.length >= 4) {
        throw new BadRequestException(
          'You Have Already Invited More than the Allocated team members in your current Plan'
        );
      }
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
