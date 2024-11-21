import { Types } from 'mongoose';
import { UserRolesEnum } from '@impler/shared';
import { BaseRepository } from '../base-repository';
import { EnvironmentEntity } from './environment.entity';
import { Environment } from './environment.schema';
import { ProjectEntity } from '../project';

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

  async getUserEnvironmentProjects(userId: string): Promise<{ name: string; _id: string; isOwner: boolean }[]> {
    const environments = await Environment.find(
      {
        'apiKeys._userId': userId,
      },
      '_id apiKeys'
    ).populate('_projectId', 'name');

    return environments
      .filter((env) => env._projectId)
      .map((env) => {
        const userApiKey = env.apiKeys.find((apiKey) => apiKey._userId.toString() === userId);

        if (!userApiKey) {
          return null;
        }

        const project = env._projectId as unknown as ProjectEntity;

        if (!project || !project.name) {
          return null;
        }

        const result = {
          name: project.name,
          _id: project._id.toString(),
          isOwner: userApiKey.isOwner || false,
          role: userApiKey.role as UserRolesEnum,
        };

        return result;
      })
      .filter((item): item is { name: string; _id: string; isOwner: boolean; role: UserRolesEnum } => item !== null);
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

  async getProjectTeamMembers(projectId: string) {
    const environment = await Environment.findOne({ _projectId: projectId }, 'apiKeys').populate(
      'apiKeys._userId',
      'firstName lastName email profilePicture'
    );

    return environment.apiKeys;
  }

  async removeTeamMember(memberId: string) {
    const result = await Environment.updateOne(
      {
        'apiKeys._id': memberId,
      },
      {
        $pull: {
          apiKeys: {
            _id: memberId,
          },
        },
      }
    );

    return result;
  }
  async updateTeamMember(memberId: string, { role }: { role: UserRolesEnum }) {
    return await Environment.updateOne(
      {
        'apiKeys._id': memberId,
      },
      {
        $set: {
          'apiKeys.$.role': role,
        },
      }
    );
  }
  async getTeamMemberDetails(memberId: string) {
    const envApiKeys = await Environment.findOne(
      {
        'apiKeys._id': new Types.ObjectId(memberId),
      },
      'apiKeys'
    ).populate('apiKeys._userId', 'firstName lastName email profilePicture');

    return envApiKeys.apiKeys.find((apiKey) => apiKey._id.toString() === memberId);
  }

  async getTeamOwnerDetails(projectId: string) {
    const teamMembers = await this.getProjectTeamMembers(projectId);
    const teamOwner = teamMembers.find((member) => member.isOwner);

    return teamOwner;
  }
}
