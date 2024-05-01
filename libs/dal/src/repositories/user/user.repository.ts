import { createHash } from 'crypto';
import { AuthProviderEnum } from '@impler/shared';
import { BaseRepository } from '../base-repository';
import { UserEntity, IUserResetTokenCount } from './user.entity';
import { User } from './user.schema';
import { Environment } from '../environment';

export class UserRepository extends BaseRepository<UserEntity> {
  constructor() {
    super(User, UserEntity);
  }

  private hashResetToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({
      email,
    });
  }

  async findUserEmailFromProjectId(_projectId: string): Promise<string> {
    const environment = await Environment.find({
      _projectId,
    }).populate([
      {
        path: 'apiKeys._userId',
      },
    ]);

    return environment?.[0]?.apiKeys[0]?._userId?.email;
  }

  async findUserByToken(token: string) {
    return await this.findOne({
      resetToken: this.hashResetToken(token),
    });
  }

  async updatePasswordResetToken(userId: string, token: string, resetTokenCount: IUserResetTokenCount) {
    return await this.update(
      {
        _id: userId,
      },
      {
        $set: {
          resetToken: this.hashResetToken(token),
          resetTokenDate: new Date(),
          resetTokenCount,
        },
      }
    );
  }

  async findByLoginProvider(profileId: string, provider: AuthProviderEnum): Promise<UserEntity | null> {
    return this.findOne({
      'tokens.providerId': profileId,
      'tokens.provider': provider,
    });
  }
}
