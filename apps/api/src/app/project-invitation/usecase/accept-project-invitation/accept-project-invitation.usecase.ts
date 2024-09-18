import { EnvironmentRepository, ProjectInvitationRepository, UserRepository, ProjectRepository } from '@impler/dal';
import { GenerateUniqueApiKey } from 'app/environment/usecases';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AcceptProjectInvitation {
  constructor(
    private environmentRepository: EnvironmentRepository,

    private projectInvitationRepository: ProjectInvitationRepository,

    private projectRepository: ProjectRepository,

    private userRepository: UserRepository,
    private generateUniqueApiKey: GenerateUniqueApiKey
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

    const _userId = (await this.userRepository.findById(userId))._id;

    const newAddedAPIKey = await this.environmentRepository.addApiKey(environment._id, key, _userId);
    if (newAddedAPIKey) {
      // const deleted = await this.projectInvitationRepository.delete({ _id: invitationId });
      return {
        projectName,
      };
    }
  }
}
