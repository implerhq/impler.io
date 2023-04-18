import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@impler/dal';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class DeleteProject {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(_projectId: string, _userId: string) {
    const project = await this.projectRepository.findOne({ _id: _projectId, _userId });
    if (!project) throw new DocumentNotFoundException('Project', _projectId);

    return this.projectRepository.delete({ _id: _projectId });
  }
}
