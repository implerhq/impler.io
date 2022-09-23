import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@impler/dal';
import { ProjectResponseDto } from '../../dtos/projects-response.dto';

@Injectable()
export class GetProjects {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(): Promise<ProjectResponseDto[]> {
    const projects = await this.projectRepository.find({});

    return projects.map((project) => {
      return {
        id: project._id,
        name: project.name,
        code: project.code,
      };
    });
  }
}
