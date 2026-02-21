import { Injectable, ForbiddenException } from '@nestjs/common';
import { EnvironmentRepository } from '@impler/dal';
import { UpdateTeammemberCommand } from './update-team-member.command';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class UpdateTeamMember {
  constructor(private environmentRepository: EnvironmentRepository) {}

  async exec(memberId: string, updateTeamMemberCommand: UpdateTeammemberCommand, _projectId?: string) {
    const teamMember = await this.environmentRepository.getTeamMemberDetails(memberId);
    if (!teamMember) throw new DocumentNotFoundException('Team Member', memberId);

    // IDOR protection: verify the team member belongs to the caller's project
    if (_projectId && teamMember._projectId && teamMember._projectId.toString() !== _projectId.toString()) {
      throw new ForbiddenException('You do not have permission to modify this team member');
    }

    await this.environmentRepository.updateTeamMember(memberId, {
      role: updateTeamMemberCommand.role,
    });

    return Object.assign(teamMember, updateTeamMemberCommand);
  }
}
