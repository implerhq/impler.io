import { Injectable } from '@nestjs/common';
import { EnvironmentRepository } from '@impler/dal';
import { EnvironmentResponseDto } from 'app/environment/dtos/environment-response.dto';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class GetEnvironment {
  constructor(private environmentRepository: EnvironmentRepository) {}

  async execute(_projectId: string): Promise<EnvironmentResponseDto> {
    const environment = await this.environmentRepository.findOne({
      _projectId,
    });
    if (!environment) {
      throw new DocumentNotFoundException('Environment', _projectId);
    }

    return {
      _id: environment._id,
      _projectId: environment._projectId,
      key: environment.key,
      apiKeys: environment.apiKeys,
    };
  }
}
