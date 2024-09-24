import { EnvironmentRepository, ProjectInvitationRepository, UserRepository, ProjectRepository } from '@impler/dal';
import { GenerateUniqueApiKey } from 'app/environment/usecases';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SCREENS, UserRolesEnum } from '@impler/shared';
import { AuthService } from 'app/auth/services/auth.service';

@Injectable()
export class AcceptProjectInvitation {
  constructor(
    private environmentRepository: EnvironmentRepository,

    private projectInvitationRepository: ProjectInvitationRepository,

    private projectRepository: ProjectRepository,

    private userRepository: UserRepository,
    private generateUniqueApiKey: GenerateUniqueApiKey,
    private authService: AuthService
  ) {}

  async exec({ invitationId, token, userId }: { invitationId: string; token: string; userId: string }) {
    const key = await this.generateUniqueApiKey.execute();
    const invitation = await this.projectInvitationRepository.findOne({ _id: invitationId, token });
    const environment = await this.environmentRepository.findOne({
      _projectId: invitation._projectId,
    });
    const projectName = (await this.projectRepository.findById(environment._projectId)).name;

    if (!environment && invitation) {
      throw new BadRequestException('Invitation not found.');
    }

    const user = await this.userRepository.findById(userId);

    const newAddedAPIKey = await this.environmentRepository.addApiKey(environment._id, key, user._id);
    if (newAddedAPIKey) {
      await this.projectInvitationRepository.delete({ _id: invitationId });

      const accessToken = this.authService.getSignedToken({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: invitation.role as UserRolesEnum,
        isEmailVerified: user.isEmailVerified,
      });

      return {
        projectName,
        accessToken,
        screen: SCREENS.HOME,
      };
    }
  }
}
