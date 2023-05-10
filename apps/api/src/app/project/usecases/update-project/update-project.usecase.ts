import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@impler/dal';
import { UpdateProjectCommand } from './update-project.command';
@Injectable()
export class UpdateProject {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(command: UpdateProjectCommand, _projectId: string, _userId: string) {
    return this.projectRepository.findOneAndUpdate({ _id: _projectId, _userId }, command);
  }
}
