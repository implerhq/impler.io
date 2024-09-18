import { EnvironmentRepository } from '@impler/dal';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListTeamMembers {
  constructor(private environmentRepository: EnvironmentRepository) {}

  async exec(projectId: string) {
    const environment = await this.environmentRepository.find({
      _projectId: projectId,
    });

    const userId = environment.forEach((env) => {
      env.apiKeys;
    });

    return userId;
  }
}
