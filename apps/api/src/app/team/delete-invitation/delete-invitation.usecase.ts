import { Injectable } from '@nestjs/common';
import { ProjectInvitationRepository } from '@impler/dal';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class DeleteInvitation {
  constructor(private projectInvitationRepository: ProjectInvitationRepository) {}

  async exec(invitationId: string) {
    const invitation = await this.projectInvitationRepository.findOne({
      _id: invitationId,
    });

    if (!invitation) {
      throw new DocumentNotFoundException('ProjectInvitations', invitationId);
    }

    return this.projectInvitationRepository.delete({ _id: invitation._id });
  }
}
