import { Injectable } from '@nestjs/common';

import { SCREENS } from '@impler/shared';
import { VerifyCommand } from './verify.command';
import { PaymentAPIService } from '@impler/services';
import { UserRepository, EnvironmentRepository } from '@impler/dal';
import { InvalidVerificationCodeException } from '@shared/exceptions/otp-verification.exception';

@Injectable()
export class Verify {
  constructor(
    private userRepository: UserRepository,
    private paymentAPIService: PaymentAPIService,
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

    const userData = {
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
      externalId: user.email,
    };

    await this.paymentAPIService.createUser(userData);

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

    return {
      screen: apiKey ? SCREENS.HOME : SCREENS.ONBOARD,
    };
  }
}
