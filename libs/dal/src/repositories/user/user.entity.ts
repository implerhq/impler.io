import { AuthProviderEnum } from '@impler/shared';
import { Exclude } from 'class-transformer';

export interface IUserToken {
  providerId: string;
  provider: AuthProviderEnum;
  accessToken: string;
}

export interface IUserResetTokenCount {
  reqInMinute: number;
  reqInDay: number;
}

export class UserEntity {
  _id: string;

  firstName?: string | null;

  lastName?: string | null;

  email?: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  profilePicture?: string | null;

  @Exclude({ toPlainOnly: true })
  tokens: IUserToken[];

  showOnBoarding?: boolean;

  @Exclude({ toPlainOnly: true })
  resetToken?: string;

  @Exclude({ toPlainOnly: true })
  resetTokenDate?: string;

  @Exclude({ toPlainOnly: true })
  resetTokenCount?: IUserResetTokenCount;

  @Exclude({ toPlainOnly: true })
  companySize?: string | null;

  @Exclude({ toPlainOnly: true })
  role?: string | null;

  @Exclude({ toPlainOnly: true })
  source?: string | null;

  @Exclude({ toPlainOnly: true })
  signupMethod?: string;

  @Exclude({ toPlainOnly: true })
  isEmailVerified: boolean;

  @Exclude({ toPlainOnly: true })
  verificationCode: string;
}
