import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { isBefore, subDays } from 'date-fns';
import { UserRepository } from '@impler/dal';

import { ResetPasswordCommand } from './reset-password.command';
import { ApiException } from '@shared/exceptions/api.exception';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class ResetPassword {
  constructor(private userRepository: UserRepository, private authService: AuthService) {}

  async execute(command: ResetPasswordCommand): Promise<{ token: string }> {
    const user = await this.userRepository.findUserByToken(command.token);
    if (!user) {
      throw new ApiException('Bad token provided');
    }

    if (user.resetTokenDate && isBefore(new Date(user.resetTokenDate), subDays(new Date(), 7))) {
      throw new ApiException('Token has expired');
    }

    const passwordHash = await bcrypt.hash(command.password, 10);

    await this.userRepository.update(
      {
        _id: user._id,
      },
      {
        $set: {
          password: passwordHash,
        },
        $unset: {
          resetToken: 1,
          resetTokenDate: 1,
          resetTokenCount: '',
        },
      }
    );

    return {
      token: await this.authService.generateUserToken(user),
    };
  }
}
