import { Injectable } from '@nestjs/common';
import { EnvironmentRepository } from '@impler/dal';

import { CreateEnvironmentCommand } from './create-environment.command';
import { GenerateUniqueApiKey } from '../generate-api-key/generate-api-key.usecase';

@Injectable()
export class CreateEnvironment {
  constructor(
    private environmentRepository: EnvironmentRepository,
    private generateUniqueApiKey: GenerateUniqueApiKey
  ) {}

  async execute(command: CreateEnvironmentCommand) {
    const key = await this.generateUniqueApiKey.execute();

    const environment = await this.environmentRepository.create({
      _projectId: command.projectId,
      key,
      apiKeys: [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore // _id will be added automatically
        {
          _userId: command._userId,
          role: command.role,
        },
      ],
    });

    return environment;
  }
}
