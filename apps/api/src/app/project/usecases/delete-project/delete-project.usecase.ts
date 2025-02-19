import { Injectable } from '@nestjs/common';
import { ProjectRepository, EnvironmentRepository } from '@impler/dal';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class DeleteProject {
  constructor(
    private projectRepository: ProjectRepository,
    private environmentRepository: EnvironmentRepository
  ) {}

  async execute(_projectId: string, _userId: string) {
    const project = await this.projectRepository.findOne({ _id: _projectId, _userId });
    if (!project) throw new DocumentNotFoundException('Project', _projectId);

    await this.environmentRepository.delete({
      _projectId: project._id,
    });

    return this.projectRepository.delete({ _id: _projectId });
  }
}
