import { Injectable } from '@nestjs/common';
import { EnvironmentRepository } from '@impler/dal';
import { UpdateTeammemberCommand } from './update-team-member.command';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class UpdateTeamMember {
  constructor(private environmentRepository: EnvironmentRepository) {}

  async exec(memberId: string, updateTeamMemberCommand: UpdateTeammemberCommand) {
    const teamMember = await this.environmentRepository.getTeamMemberDetails(memberId);
    if (!teamMember) throw new DocumentNotFoundException('Team Member', memberId);

    await this.environmentRepository.updateTeamMember(memberId, {
      role: updateTeamMemberCommand.role,
    });

    return Object.assign(teamMember, updateTeamMemberCommand);
  }
}
