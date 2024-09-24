import { Injectable } from '@nestjs/common';
import { ProjectInvitationRepository } from '@impler/dal';

@Injectable()
export class SentProjectInvitations {
  constructor(private projectInvitationRepository: ProjectInvitationRepository) {}

  async exec({ email, projectId }: { email: string; projectId: string }) {
    const invitations = await this.projectInvitationRepository.find({
      invitedBy: email,
      _projectId: projectId,
    });

    const sentInvitations = invitations.map((sentInvitation) => {
      const invitationLink = `${process.env.WEB_BASE_URL}/auth/invitation/${sentInvitation._id}`;

      return {
        ...sentInvitation,
        invitationLink,
      };
    });

    return sentInvitations;
  }
}
