import { BaseRepository } from '../base-repository';
import { EnvironmentEntity } from './environment.entity';
import { Environment } from './environment.schema';

export class EnvironmentRepository extends BaseRepository<EnvironmentEntity> {
  constructor() {
    super(Environment, EnvironmentEntity);
  }

  async addApiKey(environmentId: string, key: string, userId: string) {
    return await this.update(
      {
        _id: environmentId,
      },
      {
        $push: {
          apiKeys: {
            key,
            _userId: userId,
          },
        },
      }
    );
  }

  async findByApiKey(key: string) {
    return await this.findOne({
      'apiKeys.key': key,
    });
  }

  async getUserIdForApiKey(key: string) {
    const apiKey = await this.findOne(
      {
        'apiKeys.key': key,
      },
      'apiKeys.$'
    );

    // eslint-disable-next-line no-magic-numbers
    return apiKey ? apiKey.apiKeys[0]._userId : null;
  }

  async getApiKeyForUserId(userId: string) {
    const apiKey = await this.findOne(
      {
        'apiKeys._userId': userId,
      },
      'apiKeys.$'
    );

    return apiKey
      ? {
          projectId: apiKey._projectId,
          // eslint-disable-next-line no-magic-numbers
          apiKey: apiKey.apiKeys[0].key,
        }
      : null;
  }
}
