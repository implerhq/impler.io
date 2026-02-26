import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@impler/dal';

@Injectable()
export class GetAllowedDomains {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(projectId: string, userId: string): Promise<string[]> {
    const project = await this.projectRepository.findOne({ _id: projectId, _userId: userId }, 'allowedDomains');

    return project?.allowedDomains || [];
  }
}
