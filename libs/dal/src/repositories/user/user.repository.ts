import { AuthProviderEnum } from '@impler/shared';
import { BaseRepository } from '../base-repository';
import { UserEntity } from './user.entity';
import { User } from './user.schema';

export class UserRepository extends BaseRepository<UserEntity> {
  constructor() {
    super(User, UserEntity);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({
      email,
    });
  }

  async findByLoginProvider(profileId: string, provider: AuthProviderEnum): Promise<UserEntity | null> {
    return this.findOne({
      'tokens.providerId': profileId,
      'tokens.provider': provider,
    });
  }
}
