import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@impler/dal';
import { CreateProjectCommand } from './create-project.command';

@Injectable()
export class CreateProject {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(command: CreateProjectCommand) {
    return this.projectRepository.create(command);
  }
}
