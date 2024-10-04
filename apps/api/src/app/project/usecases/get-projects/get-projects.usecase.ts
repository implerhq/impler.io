import { Injectable } from '@nestjs/common';
import { EnvironmentRepository } from '@impler/dal';

@Injectable()
export class GetProjects {
  constructor(private environmentRepository: EnvironmentRepository) {}

  async execute(_userId: string) {
    return this.environmentRepository.getUserEnvironmentProjects(_userId);
  }
}
