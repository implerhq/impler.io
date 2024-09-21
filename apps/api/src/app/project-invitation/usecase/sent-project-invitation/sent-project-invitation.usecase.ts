import { ProjectInvitationRepository } from '@impler/dal';
import { constructQueryString } from '@impler/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SentProjectInvitations {
  constructor(private projectInvitationRepository: ProjectInvitationRepository) {}

  async exec({ email, projectId }: { email: string; projectId: string }) {
    const invitations = await this.projectInvitationRepository.find({
      invitedBy: email,
      _projectId: projectId,
    });

    const sentInvitations = invitations.map((sentInvitation) => {
      const invitationLink = `${process.env.WEB_BASE_URL}/team-members${constructQueryString({
        invitationId: sentInvitation._id,
        token: sentInvitation.token,
      })}`;

      return {
        ...sentInvitation,
        invitationLink,
      };
    });

    return sentInvitations;
  }
}
