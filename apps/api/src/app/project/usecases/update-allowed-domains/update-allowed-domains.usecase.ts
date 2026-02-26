import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@impler/dal';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class UpdateAllowedDomains {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(projectId: string, allowedDomains: string[], userId: string): Promise<string[]> {
    const project = await this.projectRepository.findOneAndUpdate(
      { _id: projectId, _userId: userId },
      { allowedDomains }
    );
    if (!project) {
      throw new DocumentNotFoundException('Project', projectId);
    }

    return allowedDomains;
  }
}
