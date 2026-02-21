import { Injectable, ForbiddenException } from '@nestjs/common';
import { EnvironmentRepository } from '@impler/dal';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class RemoveTeamMember {
  constructor(private environmentRepository: EnvironmentRepository) {}

  async exec(memberId: string, _projectId?: string) {
    const teamMember = await this.environmentRepository.getTeamMemberDetails(memberId);
    if (!teamMember) throw new DocumentNotFoundException('TeamMember', memberId);

    // IDOR protection: verify the team member belongs to the caller's project
    if (_projectId && teamMember._projectId && teamMember._projectId.toString() !== _projectId.toString()) {
      throw new ForbiddenException('You do not have permission to remove this team member');
    }

    await this.environmentRepository.removeTeamMember(memberId);

    return teamMember;
  }
}
