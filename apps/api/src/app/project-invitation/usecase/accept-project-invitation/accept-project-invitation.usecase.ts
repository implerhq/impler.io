import { ProjectInvitationRepository } from '@impler/dal';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class GetInvitation {
  constructor(private projectInvitationRepository: ProjectInvitationRepository) {}

  async exec({ invitationId, token }: { invitationId: string; token: string }) {
    const invitation = await this.projectInvitationRepository.findOne({
      _id: invitationId,
      token,
    });

    if (!invitation) {
      throw new BadRequestException('Invitation not found or token is invalid.');
    }

    return { email: invitation.invitationToEmail };
  }
}
