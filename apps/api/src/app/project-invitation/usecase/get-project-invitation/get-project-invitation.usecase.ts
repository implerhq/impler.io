import { ProjectInvitationRepository } from '@impler/dal';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class GetProjectInvitation {
  constructor(private projectInvitationRepository: ProjectInvitationRepository) {}

  async exec(invitationId: string) {
    const invitationData = await this.projectInvitationRepository.getInvitationData(invitationId);
    if (!invitationData) {
      throw new BadRequestException('Invitation not found or token is invalid.');
    }

    return invitationData;
  }
}
