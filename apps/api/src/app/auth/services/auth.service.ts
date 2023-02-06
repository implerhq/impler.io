import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity, UserRepository, MemberRepository, MemberEntity } from '@impler/dal';
import { IJwtPayload, MemberStatusEnum } from '@impler/shared';
import { UserNotFoundException } from '@shared/exceptions/user-not-found.exception';
import { IAuthenticationData, IStrategyResponse } from '@shared/types/auth.types';
import { UniqueEmailException } from '@shared/exceptions/unique-email.exception';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private memberRepository: MemberRepository
  ) {}

  async authenticate({
    profile,
    provider,
    _invitationId,
    validateUniqueEmail,
  }: IAuthenticationData): Promise<IStrategyResponse> {
    let showAddProject = false;
    let userCreated = false;
    // get or create the user
    let user = await this.userRepository.findOne({ email: profile.email });
    if (user && validateUniqueEmail) {
      throw new UniqueEmailException();
    }

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

    // update member or get member
    const member: MemberEntity = await this.memberRepository.findOne({
      $or: [{ _id: _invitationId }, { 'invite.email': profile.email }],
    });

    if (!member) {
      // invitationId is not valid
      showAddProject = true;
    } else if (userCreated && member?._id) {
      // accept invitation or add user to project only first time
      await this.memberRepository.findOneAndUpdate(
        { _id: member._id },
        {
          _userId: user._id,
          'invite.answerDate': new Date(),
          memberStatus: MemberStatusEnum.ACTIVE,
        }
      );
    }

    return {
      user,
      userCreated,
      showAddProject,
      token: await this.getSignedToken(user, member._projectId, member.role),
    };
  }

  async refreshToken(userId: string) {
    const user = await this.getUser({ _id: userId });
    if (!user) throw new UnauthorizedException('User not found');

    return this.getSignedToken(user);
  }

  async getSignedToken(user: UserEntity, _projectId?: string, role?: string): Promise<string> {
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
