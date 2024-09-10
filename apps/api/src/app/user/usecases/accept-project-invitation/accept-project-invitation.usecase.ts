import { ProjectInvitationRepository, EnvironmentRepository } from '@impler/dal';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AcceptProjectInvitation {
  constructor(
    private projectInvitationRepository: ProjectInvitationRepository,
    private environmentRepository: EnvironmentRepository
  ) {}

  async exec({ invitationId, token }: { invitationId: string; token: string }) {
    console.log('ACCEPT INVITATION PARAMS>', {
      invitationId,
      token,
    });

    const invitation = await this.projectInvitationRepository.findOne({
      _id: invitationId,
      token,
    });

    if (!invitation) {
      throw new BadRequestException('Invitation not found or token is invalid.');
    }

    console.log('Invitation Email:', invitation.invitationToEmail);

    /*
     * TODO
     *  this.environmentRepository.update({
     */

    // })

    return invitation.invitationToEmail as string;
  }
}
