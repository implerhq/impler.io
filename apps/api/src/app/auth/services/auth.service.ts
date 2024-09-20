import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { IJwtPayload, UserRolesEnum } from '@impler/shared';
import { CONSTANTS, LEAD_SIGNUP_USING } from '@shared/constants';
import { UserEntity, UserRepository, EnvironmentRepository } from '@impler/dal';
import { UserNotFoundException } from '@shared/exceptions/user-not-found.exception';
import { IAuthenticationData, IStrategyResponse } from '@shared/types/auth.types';
import { IncorrectLoginCredentials } from '@shared/exceptions/incorrect-login-credentials.exception';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private environmentRepository: EnvironmentRepository
  ) {}

  async authenticate({ profile, provider }: IAuthenticationData): Promise<IStrategyResponse> {
    let showAddProject = false;
    let userCreated = false;
    // get or create the user
    let user = await this.userRepository.findOne({ email: profile.email });

    if (!user) {
      const userObj: Partial<UserEntity> = {
        email: profile.email,
        isEmailVerified: true,
        firstName: profile.firstName,
        lastName: profile.lastName,
        signupMethod: LEAD_SIGNUP_USING.GITHUB,
        profilePicture: profile.avatar_url,
        ...(provider ? { tokens: [provider] } : {}),
      };
      user = await this.userRepository.create(userObj);
      userCreated = true;
    }
    if (!user) {
      throw new UserNotFoundException();
    }
    const apiKey = await this.environmentRepository.getApiKeyForUserId(user._id);
    if (!apiKey) {
      showAddProject = true;
    }

    return {
      user,
      userCreated,
      showAddProject,
      token: this.getSignedToken(
        {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: apiKey.role as UserRolesEnum,
          profilePicture: user.profilePicture,
          accessToken: apiKey?.apiKey,
          isEmailVerified: user.isEmailVerified,
        },
        apiKey?.projectId
      ),
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new IncorrectLoginCredentials();
    }

    const doesPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!doesPasswordMatch) {
      throw new IncorrectLoginCredentials();
    }

    let showAddProject = true;
    const apiKey = await this.environmentRepository.getApiKeyForUserId(user._id);
    if (apiKey) {
      showAddProject = false;
    }

    return {
      user,
      showAddProject,
      token: this.getSignedToken(
        {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: apiKey.role as UserRolesEnum,
          accessToken: apiKey?.apiKey,
          isEmailVerified: user.isEmailVerified,
        },
        apiKey?.projectId
      ),
    };
  }

  async refreshToken(userId: string) {
    const user = await this.getUser({ _id: userId });
    if (!user) throw new UnauthorizedException('User not found');

    const apiKey = await this.environmentRepository.getApiKeyForUserId(user._id);

    return this.getSignedToken(
      {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: apiKey.role as UserRolesEnum,
        accessToken: apiKey?.apiKey,
        isEmailVerified: user.isEmailVerified,
      },
      apiKey?.projectId
    );
  }

  getSignedToken(
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      role?: UserRolesEnum;
      isEmailVerified: boolean;
      profilePicture?: string;
      accessToken?: string;
    },
    _projectId?: string
  ): string {
    return (
      `Bearer ` +
      this.jwtService.sign(
        {
          _id: user._id,
          _projectId,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          profilePicture: user.profilePicture,
          accessToken: user.accessToken,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: CONSTANTS.maxAge,
          issuer: 'impler',
        }
      )
    );
  }

  async validateUser(payload: IJwtPayload): Promise<UserEntity> {
    const user = await this.getUser({ _id: payload._id });
    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }

  async decodeJwt<T>(token: string) {
    return this.jwtService.decode(token) as T;
  }

  async verifyJwt(jwt: string) {
    return this.jwtService.verify(jwt);
  }

  private async getUser({ _id }: { _id: string }) {
    return await this.userRepository.findById(_id);
  }

  async apiKeyAuthenticate(apiKey: string) {
    const environment = await this.environmentRepository.findByApiKey(apiKey);
    if (!environment) throw new UnauthorizedException('API Key not found!');

    if (apiKey !== environment.key) throw new UnauthorizedException('API Key not found!');
  }

  async generateUserToken(user: UserEntity) {
    const apiKey = await this.environmentRepository.getApiKeyForUserId(user._id);

    return this.getSignedToken(
      {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: apiKey.role as UserRolesEnum,
        accessToken: apiKey?.apiKey,
        isEmailVerified: user.isEmailVerified,
      },
      apiKey?.projectId
    );
  }
}
