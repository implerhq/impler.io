import { Injectable } from '@nestjs/common';
import { EnvironmentRepository } from '@impler/dal';
import { UpdateTeamMemberCommand } from './update-team-member.command';

@Injectable()
export class UpdateTeamMember {
  constructor(private environmentRepository: EnvironmentRepository) {}

  async exec(updateTeamMemberCommand: UpdateTeamMemberCommand) {
    return await this.environmentRepository.updateTeamMemberRole({
      projectId: updateTeamMemberCommand.projectId,
      userId: updateTeamMemberCommand.userId,
      newRole: updateTeamMemberCommand.role,
    });
  }
}
