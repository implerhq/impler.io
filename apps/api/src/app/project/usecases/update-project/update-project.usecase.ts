import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@impler/dal';
import { UpdateProjectCommand } from './update-project.command';

@Injectable()
export class UpdateProject {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(command: UpdateProjectCommand, id: string) {
    return this.projectRepository.findOneAndUpdate({ _id: id }, command);
  }
}
