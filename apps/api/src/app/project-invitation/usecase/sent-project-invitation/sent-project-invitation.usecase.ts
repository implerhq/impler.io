import { ProjectInvitationRepository } from '@impler/dal';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SentProjectInvitations {
  constructor(private projectInvitationRepository: ProjectInvitationRepository) {}

  async exec({ email, projectId }: { email: string; projectId: string }) {
    const sentInvitation = await this.projectInvitationRepository.find({
      invitedBy: email,
      _projectId: projectId,
    });

    return sentInvitation;
  }
}
