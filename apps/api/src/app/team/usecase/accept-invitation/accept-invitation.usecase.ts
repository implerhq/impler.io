import { Injectable } from '@nestjs/common';

import { AuthService } from 'app/auth/services/auth.service';
import { IJwtPayload, SCREENS, UserRolesEnum } from '@impler/shared';
import { EnvironmentRepository, ProjectInvitationRepository } from '@impler/dal';

@Injectable()
export class AcceptInvitation {
  constructor(
    private authService: AuthService,
    private environmentRepository: EnvironmentRepository,
    private projectInvitationRepository: ProjectInvitationRepository
  ) {}

  async exec({ invitationId, user }: { invitationId: string; user: IJwtPayload }) {
    const invitation = await this.projectInvitationRepository.findOne({ _id: invitationId });
    const environment = await this.environmentRepository.findOne({
      _projectId: invitation._projectId,
    });

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
}
