import { Injectable } from '@nestjs/common';

import { UserRepository } from '@impler/dal';
import { PaymentAPIService } from '@impler/services';
import { VerifyCommand } from './verify.command';
import { InvalidVerificationCodeException } from '@shared/exceptions/otp-verification.exception';
import { SCREENS } from '@impler/shared';

@Injectable()
export class Verify {
  constructor(
    private userRepository: UserRepository,
    private paymentAPIService: PaymentAPIService
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

    return {
      screen: SCREENS.ONBOARD,
    };
  }
}
