import { Injectable } from '@nestjs/common';
import { AuthService } from 'app/auth/services/auth.service';
import { EmailService, PaymentAPIService } from '@impler/services';
import { EMAIL_SUBJECT, IJwtPayload, SCREENS, UserRolesEnum } from '@impler/shared';
import {
  ProjectEntity,
  ProjectRepository,
  EnvironmentRepository,
  ProjectInvitationEntity,
  ProjectInvitationRepository,
} from '@impler/dal';
import { LEAD_SIGNUP_USING } from '@shared/constants';
import { LeadService } from '@shared/services/lead.service';
import { captureException } from '@shared/helpers/common.helper';

@Injectable()
export class AcceptInvitation {
  constructor(
    private leadService: LeadService,
    private authService: AuthService,
    private emailService: EmailService,
    private projectRepository: ProjectRepository,
    private paymentAPIService: PaymentAPIService,
    private environmentRepository: EnvironmentRepository,
    private projectInvitationRepository: ProjectInvitationRepository
  ) {}

  async exec({ invitationId, user }: { invitationId: string; user: IJwtPayload }) {
    const invitation = await this.projectInvitationRepository.findOne({ _id: invitationId });
    const environment = await this.environmentRepository.findOne({
      _projectId: invitation._projectId,
    });
    const userProjects = await this.environmentRepository.count({
      'apiKeys._userId': user._id,
    });
    if (userProjects < 1) await this.registerUser(user);

    const project = await this.projectRepository.findOne({ _id: environment._projectId });

    await this.sendEmails(invitation, project);

    await this.environmentRepository.addApiKey(environment._id, user._id, invitation.role);

    await this.projectInvitationRepository.delete({ _id: invitationId });

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
  async sendEmails(invitation: ProjectInvitationEntity, project: ProjectEntity) {
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
  }
  async registerUser(user: IJwtPayload) {
    try {
      const userData = {
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
        externalId: user.email,
      };
      await this.paymentAPIService.createUser(userData);
      await this.leadService.createLead({
        'First Name': user.firstName,
        'Last Name': user.lastName,
        'Lead Email': user.email,
        'Lead Source': 'Invitation',
        'Mentioned Role': user.role,
        'Signup Method': LEAD_SIGNUP_USING.EMAIL,
        'Company Size': user.companySize,
      });
    } catch (error) {
      captureException(error);
    }
  }
}
