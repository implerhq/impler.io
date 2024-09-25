import { Injectable } from '@nestjs/common';

import { AuthService } from 'app/auth/services/auth.service';
import { IJwtPayload, SCREENS, UserRolesEnum } from '@impler/shared';
import { EnvironmentRepository, ProjectInvitationRepository } from '@impler/dal';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class DeclineInvitation {
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

    if (!invitation) throw new DocumentNotFoundException('Invitation', invitationId);

    await this.projectInvitationRepository.delete({ _id: invitationId });

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

    //condition - if not auth token then send them to the onboard

    return {
      accessToken,
      screen: SCREENS.ONBOARD,
    };
  }
}
