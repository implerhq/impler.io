import { AuthProviderEnum } from '@impler/shared';

export interface IAuthenticationData {
  profile: {
    email: string;
    avatar_url: string;
    firstName: string;
    lastName: string;
  };
  _invitationId?: string;
  provider?: {
    accessToken: string;
    provider: AuthProviderEnum;
    providerId: string;
  };
}

export interface IStrategyResponse {
  user: any;
  userCreated: boolean;
  showAddProject: boolean;
  token: string;
}
