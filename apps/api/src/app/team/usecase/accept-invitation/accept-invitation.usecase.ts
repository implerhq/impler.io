import { Injectable } from '@nestjs/common';
import { EmailService } from '@impler/services';
import { AuthService } from 'app/auth/services/auth.service';
import { EMAIL_SUBJECT, IJwtPayload, SCREENS, UserRolesEnum } from '@impler/shared';
import { EnvironmentRepository, ProjectInvitationRepository, ProjectRepository } from '@impler/dal';

@Injectable()
export class AcceptInvitation {
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

    await this.environmentRepository.addApiKey(environment._id, user._id, invitation.role);

    await this.projectInvitationRepository.delete({ _id: invitationId });

    const emailContentsSender = this.emailService.getEmailContent({
      type: 'ACCEPT_PROJECT_INVITATION_RECIEVER_EMAIL',
      data: {
        acceptedBy: invitation.invitationToEmail,
        invitedBy: invitation.invitedBy,
        projectName: project.name,
      },
    });
    const emailContentsReciever = this.emailService.getEmailContent({
      type: 'ACCEPT_PROJECT_INVITATION_SENDER_EMAIL',
      data: {
        acceptedBy: invitation.invitationToEmail,
        invitedBy: invitation.invitedBy,
        projectName: project.name,
      },
    });

    await this.emailService.sendEmail({
      to: invitation.invitationToEmail,
      subject: EMAIL_SUBJECT.INVITATION_ACCEPTED,
      html: emailContentsSender,
      from: process.env.EMAIL_FROM,
      senderName: process.env.EMAIL_FROM_NAME,
    });

    await this.emailService.sendEmail({
      to: invitation.invitedBy,
      subject: EMAIL_SUBJECT.INVITATION_ACCEPTED,
      html: emailContentsReciever,
      from: process.env.EMAIL_FROM,
      senderName: process.env.EMAIL_FROM_NAME,
    });

    const accessToken = this.authService.getSignedToken(
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: invitation.role as UserRolesEnum,
        isEmailVerified: true,
        profilePicture: user.profilePicture,
        accessToken: environment.key,
      },
      invitation._projectId
    );

    return {
      accessToken,
      screen: SCREENS.HOME,
    };
  }
}
