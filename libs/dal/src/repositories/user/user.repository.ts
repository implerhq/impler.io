import { createHash } from 'crypto';
import { AuthProviderEnum } from '@impler/shared';
import { BaseRepository } from '../base-repository';
import { UserEntity } from './user.entity';
import { User } from './user.schema';

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

  async updatePasswordResetToken(userId: string, token: string) {
    return await this.update(
      {
        _id: userId,
      },
      {
        $set: {
          resetToken: this.hashResetToken(token),
          resetTokenDate: new Date(),
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
