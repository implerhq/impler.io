import { Injectable } from '@nestjs/common';
import { EnvironmentRepository, UserRepository } from '@impler/dal';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class DeleteTeamMember {
  constructor(
    private environmentRepository: EnvironmentRepository,
    private userRepository: UserRepository
  ) {}

  async exec(memberId: string) {
    const teamMember = await this.environmentRepository.getTeamMemberDetails(memberId);
    if (!teamMember) throw new DocumentNotFoundException('TeamMember', memberId);

    await this.environmentRepository.deleteTeamMember(memberId);

    return teamMember;
  }
}
