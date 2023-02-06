import { AuthProviderEnum } from '@impler/shared';
import { Exclude } from 'class-transformer';

export interface IUserToken {
  providerId: string;
  provider: AuthProviderEnum;
  accessToken: string;
}

export class UserEntity {
  _id: string;

  firstName?: string | null;

  lastName?: string | null;

  email?: string | null;

  profilePicture?: string | null;

  @Exclude({ toPlainOnly: true })
  tokens: IUserToken[];

  showOnBoarding?: boolean;
}
