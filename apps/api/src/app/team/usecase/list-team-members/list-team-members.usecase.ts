import { EnvironmentRepository } from '@impler/dal';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListTeamMembers {
  constructor(private environmentRepository: EnvironmentRepository) {}

  async exec(projectId: string) {
    const environment = await this.environmentRepository.getProjectTeamMembers(projectId);

    return environment;
  }
}
