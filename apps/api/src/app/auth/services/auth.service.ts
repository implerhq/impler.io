import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '@impler/shared';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity, UserRepository, EnvironmentRepository } from '@impler/dal';
import { UserNotFoundException } from '@shared/exceptions/user-not-found.exception';
import { IAuthenticationData, IStrategyResponse } from '@shared/types/auth.types';
import { IncorrectLoginCredentials } from '@shared/exceptions/incorrect-login-credentials.exception';
import { LeadService } from '@shared/services/lead.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private leadService: LeadService,
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
        firstName: profile.firstName,
        lastName: profile.lastName,
        profilePicture: profile.avatar_url,
        ...(provider ? { tokens: [provider] } : {}),
      };
      user = await this.userRepository.create(userObj);
      await this.leadService.createLead({
        'First Name': user.firstName,
        'Last Name': user.lastName,
        'Lead Email': user.email,
      });
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
          profilePicture: user.profilePicture,
          accessToken: apiKey?.apiKey,
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
          accessToken: apiKey?.apiKey,
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
        accessToken: apiKey?.apiKey,
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
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
          accessToken: user.accessToken,
        },
        {
          expiresIn: '30 days',
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
    if (!environment) throw new UnauthorizedException('API Key not found');

    const key = environment.apiKeys.find((i) => i.key === apiKey);
    if (!key) throw new UnauthorizedException('API Key not found');

    const user = await this.getUser({ _id: key._userId });
    if (!user) throw new UnauthorizedException('User not found');

    return this.getSignedToken(
      {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accessToken: apiKey,
      },
      environment._projectId
    );
  }

  async generateUserToken(user: UserEntity) {
    const apiKey = await this.environmentRepository.getApiKeyForUserId(user._id);

    return this.getSignedToken(
      {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        accessToken: apiKey?.apiKey,
      },
      apiKey?.projectId
    );
  }
}
