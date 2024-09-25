import { EnvironmentRepository } from '@impler/dal';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListTeamMembers {
  constructor(private environmentRepository: EnvironmentRepository) {}

  async exec(projectId: string) {
    return await this.environmentRepository.listTeamMembersByProjectId(projectId);
  }
}
