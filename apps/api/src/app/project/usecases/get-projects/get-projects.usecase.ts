import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@impler/dal';
import { ProjectResponseDto } from '../../dtos/project-response.dto';

@Injectable()
export class GetProjects {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(_userId: string): Promise<ProjectResponseDto[]> {
    const response = await this.projectRepository.getUserProjects(_userId);

    return response;
  }
}
