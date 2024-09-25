import { Injectable } from '@nestjs/common';
import { EnvironmentRepository } from '@impler/dal';
import { ProjectResponseDto } from '../../dtos/project-response.dto';

@Injectable()
export class GetProjects {
  constructor(private environmentRepository: EnvironmentRepository) {}

  async execute(_userId: string): Promise<ProjectResponseDto[]> {
    return this.environmentRepository.getUserEnvironmentProjects(_userId);
  }
}
