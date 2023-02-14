import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '@impler/shared';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity, UserRepository, MemberRepository, MemberEntity } from '@impler/dal';
import { UserNotFoundException } from '@shared/exceptions/user-not-found.exception';
import { IAuthenticationData, IStrategyResponse } from '@shared/types/auth.types';
import { IncorrectLoginCredentials } from '@shared/exceptions/incorrect-login-credentials.exception';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private memberRepository: MemberRepository
  ) {}

  async authenticate({ profile, provider }: IAuthenticationData): Promise<IStrategyResponse> {
    const showAddProject = false;
    let userCreated = false;
    // get or create the user
    let user = await this.userRepository.findOne({ email: profile.email });

    if (!user) {
      const userObj: Partial<UserEntity> = {
        ...profile,
        ...(provider ? { tokens: [provider] } : {}),
      };
      user = await this.userRepository.create(userObj);
      userCreated = true;
    }
    if (!user) {
      throw new UserNotFoundException();
    }

    return {
      user,
      userCreated,
      showAddProject,
      token: await this.getSignedToken({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }),
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
    const member: MemberEntity = await this.memberRepository.findOne({
      $or: [{ _userId: user._id }],
    });
    if (member) {
      showAddProject = false;
    }

    return {
      user,
      showAddProject,
      token: await this.getSignedToken(
        { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName },
        member?._projectId,
        member?.role
      ),
    };
  }

  async refreshToken(userId: string) {
    const user = await this.getUser({ _id: userId });
    if (!user) throw new UnauthorizedException('User not found');

    return this.getSignedToken({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }

  async getSignedToken(
    user: { _id: string; firstName: string; lastName: string; email: string; profilePicture?: string },
    _projectId?: string,
    role?: string
  ): Promise<string> {
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
          role,
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
}
