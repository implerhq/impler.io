import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@impler/dal';
import { CreateProjectCommand } from './create-project.command';
import { CreateEnvironment } from 'app/environment/usecases/create-environment/create-environment.usecase';

@Injectable()
export class CreateProject {
  constructor(private projectRepository: ProjectRepository, private readonly createEnvironment: CreateEnvironment) {}

  async execute(command: CreateProjectCommand) {
    const project = await this.projectRepository.create(command);

    const environment = await this.createEnvironment.execute({
      projectId: project._id,
      _userId: command._userId,
    });

    return {
      project,
      environment,
    };
  }
}
