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
      key,
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

  async getUserEnvironmentProjects(userId: string): Promise<{ name: string; _id: string }[]> {
    const environments = await Environment.find(
      {
        'apiKeys._userId': userId,
      },
      '_id'
    ).populate('_projectId', 'name');

    return environments.map((env) => ({
      name: env._projectId.name,
      _id: env._projectId._id,
    }));
  }

  async getApiKeyForUserId(userId: string) {
    const userEnvironment = await this.findOne({
      'apiKeys._userId': userId,
    });

    return userEnvironment
      ? {
          projectId: userEnvironment._projectId,
          // eslint-disable-next-line no-magic-numbers
          apiKey: userEnvironment.key,
        }
      : null;
  }
}
