import { UserRolesEnum } from '@impler/shared';
import { BaseRepository } from '../base-repository';
import { EnvironmentEntity } from './environment.entity';
import { Environment } from './environment.schema';

export class EnvironmentRepository extends BaseRepository<EnvironmentEntity> {
  constructor() {
    super(Environment, EnvironmentEntity);
  }

  async addApiKey(environmentId: string, userId: string, role: string) {
    return await this.update(
      {
        _id: environmentId,
      },
      {
        $push: {
          apiKeys: {
            _userId: userId,
            role,
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

  async getApiKeyForUserId(userId: string): Promise<{ projectId: string; apiKey: string; role: string } | null> {
    const userEnvironment = await this.findOne({
      'apiKeys._userId': userId,
    });

    if (userEnvironment) {
      const userApiKey = userEnvironment.apiKeys.find((apiKey) => apiKey._userId.toString() === userId);

      return {
        projectId: userEnvironment._projectId,
        apiKey: userEnvironment.key,
        role: userApiKey ? userApiKey.role : null,
      };
    }

    return null;
  }

  async listTeamMembersByProjectId(projectId: string) {
    return await Environment.find({ _projectId: projectId }, { apiKeys: 1, _projectId: 1 }).populate(
      'apiKeys._userId',
      'firstName lastName email profilePicture'
    );
  }

  async deleteTeamMember(projectId: string, userId: string) {
    const result = await Environment.updateOne(
      {
        _projectId: projectId,
        'apiKeys._userId': userId,
      },
      {
        $pull: {
          apiKeys: {
            _userId: userId,
          },
        },
      }
    );

    return result;
  }
  async updateTeamMemberRole({
    projectId,
    newRole,
    userId,
  }: {
    projectId: string;
    userId: string;
    newRole: UserRolesEnum;
  }) {
    const result = await Environment.updateOne(
      {
        _projectId: projectId,
        'apiKeys._userId': userId,
      },
      {
        $set: {
          'apiKeys.$.role': newRole,
        },
      }
    );

    return result;
  }
}
