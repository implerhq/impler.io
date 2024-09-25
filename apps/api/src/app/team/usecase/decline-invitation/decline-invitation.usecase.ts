import { Injectable } from '@nestjs/common';

import { AuthService } from 'app/auth/services/auth.service';
import { EMAIL_SUBJECT, IJwtPayload, SCREENS, UserRolesEnum } from '@impler/shared';
import { EnvironmentRepository, ProjectInvitationRepository, ProjectRepository } from '@impler/dal';
import { EmailService } from '@impler/services';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class DeclineInvitation {
  constructor(
    private authService: AuthService,
    private environmentRepository: EnvironmentRepository,
    private projectInvitationRepository: ProjectInvitationRepository,
    private projectRepository: ProjectRepository,
    private emailService: EmailService
  ) {}

  async exec({ invitationId, user }: { invitationId: string; user: IJwtPayload }) {
    const invitation = await this.projectInvitationRepository.findOne({ _id: invitationId });
    const environment = await this.environmentRepository.findOne({
      _projectId: invitation._projectId,
    });

    const project = await this.projectRepository.findOne({ _id: environment._projectId });

    if (!invitation) throw new DocumentNotFoundException('Invitation', invitationId);

    await this.projectInvitationRepository.delete({ _id: invitationId });

    const emailContents = this.emailService.getEmailContent({
      type: 'DECLINE_INVITATION_EMAIL',
      data: {
        declinedBy: invitation.invitationToEmail,
        invitedBy: invitation.invitationToEmail,
        projectName: project.name,
      },
    });
    await this.emailService.sendEmail({
      to: invitation.invitedBy,
      subject: `${invitation.invitationToEmail} ${EMAIL_SUBJECT.INVITATION_DECLINED}`,
      html: emailContents,
      from: process.env.EMAIL_FROM,
      senderName: process.env.EMAIL_FROM_NAME,
    });

    const accessToken = this.authService.getSignedToken({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: UserRolesEnum.ADMIN,
      isEmailVerified: true,
      profilePicture: user.profilePicture,
      accessToken: environment.key,
    });

    return {
      accessToken,
      screen: SCREENS.ONBOARD,
    };
  }
}
