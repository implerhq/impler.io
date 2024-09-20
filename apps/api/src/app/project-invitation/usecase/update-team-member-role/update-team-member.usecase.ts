import { Injectable } from '@nestjs/common';
import { EnvironmentRepository } from '@impler/dal';
import { UpdateTeamMemberRoleCommand } from './update-team-member.command';

@Injectable()
export class UpdateTeamMemberRole {
  constructor(private environmentRepository: EnvironmentRepository) {}

  async exec(updateTeamMemberRoleCommand: UpdateTeamMemberRoleCommand) {
    return await this.environmentRepository.updateTeamMemberRole({
      projectId: updateTeamMemberRoleCommand.projectId,
      userId: updateTeamMemberRoleCommand.userId,
      newRole: updateTeamMemberRoleCommand.role,
    });
  }
}
