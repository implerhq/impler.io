import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@impler/dal';
import { CreateEnvironment } from 'app/environment/usecases';
import { CreateProjectCommand } from './create-project.command';
import { UserRolesEnum } from '@impler/shared';

@Injectable()
export class CreateProject {
  constructor(
    private projectRepository: ProjectRepository,
    private readonly createEnvironment: CreateEnvironment
  ) {}

  async execute(command: CreateProjectCommand) {
    const project = await this.projectRepository.create({
      ...command,
      name: command.name,
    });

    const environment = await this.createEnvironment.execute({
      projectId: project._id,
      _userId: command._userId,
      role: UserRolesEnum.ADMIN,
      isOwner: true,
    });

    return {
      project,
      environment,
    };
  }
}
