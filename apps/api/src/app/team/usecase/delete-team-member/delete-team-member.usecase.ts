import { Injectable } from '@nestjs/common';
import { EnvironmentRepository } from '@impler/dal';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class RemoveTeamMember {
  constructor(private environmentRepository: EnvironmentRepository) {}

  async exec(memberId: string) {
    const teamMember = await this.environmentRepository.getTeamMemberDetails(memberId);
    if (!teamMember) throw new DocumentNotFoundException('TeamMember', memberId);

    await this.environmentRepository.removeTeamMember(memberId);

    return teamMember;
  }
}
