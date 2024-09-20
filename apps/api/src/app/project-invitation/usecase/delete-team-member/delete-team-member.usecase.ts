import { EnvironmentRepository } from '@impler/dal';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteTeamMember {
  constructor(private environmentRepository: EnvironmentRepository) {}

  async exec({ projectId, userId }: { projectId: string; userId: string }) {
    return await this.environmentRepository.deleteTeamMember(projectId, userId);
  }
}
