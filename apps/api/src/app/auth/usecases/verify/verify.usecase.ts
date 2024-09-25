import { Injectable } from '@nestjs/common';

import { SCREENS, UserRolesEnum } from '@impler/shared';
import { VerifyCommand } from './verify.command';
import { AuthService } from 'app/auth/services/auth.service';
import { UserRepository, EnvironmentRepository } from '@impler/dal';
import { InvalidVerificationCodeException } from '@shared/exceptions/otp-verification.exception';

@Injectable()
export class Verify {
  constructor(
    private authService: AuthService,
    private userRepository: UserRepository,
    private environmentRepository: EnvironmentRepository
  ) {}

  async execute(_userId: string, command: VerifyCommand) {
    const user = await this.userRepository.findOne({
      _id: _userId,
      verificationCode: command.code,
    });

    if (!user) {
      throw new InvalidVerificationCodeException();
    }

    await this.userRepository.findOneAndUpdate(
      {
        _id: _userId,
      },
      {
        $set: {
          isEmailVerified: true,
        },
      }
    );
    const apiKey = await this.environmentRepository.getApiKeyForUserId(user._id);

    const token = this.authService.getSignedToken({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: apiKey?.role as UserRolesEnum,
      isEmailVerified: true,
      accessToken: apiKey?.apiKey,
    });

    return {
      token,
      screen: apiKey ? SCREENS.HOME : SCREENS.ONBOARD,
    };
  }
}
