import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as githubPassport from 'passport-github2';
import { Metadata, StateStoreStoreCallback, StateStoreVerifyCallback } from 'passport-oauth2';
import { AuthProviderEnum } from '@impler/shared';
import { AuthService } from '../auth.service';
import { IStrategyResponse } from '@shared/types/auth.types';
import { CONSTANTS } from '@shared/constants';

@Injectable()
export class GitHubStrategy extends PassportStrategy(githubPassport.Strategy, 'github') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_OAUTH_CLIENT_ID,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_OAUTH_REDIRECT,
      scope: ['user:email'],
      passReqToCallback: true,
      store: {
        verify(req, state: string, meta: Metadata, callback: StateStoreVerifyCallback) {
          callback(null, true, JSON.stringify(req.query));
        },
        store(req, meta: Metadata, callback: StateStoreStoreCallback) {
          callback(null, JSON.stringify(req.query));
        },
      },
    });
  }

  async validate(
    req: any,
    accessToken: string,
    _refreshToken: string,
    githubProfile,
    done: (err: string, data?: IStrategyResponse) => void
  ) {
    try {
      const query = this.parseState(req);
      const profileData = githubProfile._json;
      // eslint-disable-next-line no-magic-numbers
      const email = githubProfile.emails[0].value;
      const response = await this.authService.authenticate({
        _invitationId: query?.invitationId,
        profile: {
          avatar_url: profileData.avatar_url || CONSTANTS.DEFAULT_USER_AVATAR,
          email,
          // eslint-disable-next-line no-magic-numbers
          lastName: profileData.name ? profileData.name.split(' ').slice(-1).join(' ') : null,
          // eslint-disable-next-line no-magic-numbers
          firstName: profileData.name ? profileData.name.split(' ').slice(0, -1).join(' ') : profileData.login,
        },
        provider: {
          accessToken,
          provider: AuthProviderEnum.GITHUB,
          providerId: profileData.id,
        },
      });

      done(null, response);
    } catch (err) {
      done((err as Error).message);
    }
  }

  private parseState(req: any) {
    try {
      return JSON.parse(req.query.state);
    } catch (e) {
      return {};
    }
  }
}
