import * as bcrypt from 'bcryptjs';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { LoginUserCommand } from './login-user.command';
import { AuthService } from '../../services/auth.service';
import { EnvironmentRepository, UserRepository } from '@impler/dal';
import { SCREENS } from '@impler/shared';

@Injectable()
export class LoginUser {
  constructor(
    private authService: AuthService,
    private userRepository: UserRepository,
    private environmentRepository: EnvironmentRepository
  ) {}

  async execute(command: LoginUserCommand) {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new UnauthorizedException('Incorrect email or password provided.');
    }

    if (!user.password) throw new BadRequestException('OAuth user login attempt');

    const isMatching = await bcrypt.compare(command.password, user.password);
    if (!isMatching) {
      throw new UnauthorizedException(`Incorrect email or password provided.`);
    }

    const apiKey = await this.environmentRepository.getApiKeyForUserId(user._id);

    if (!user.isEmailVerified) {
      // send verification cod
    }

    return {
      screen: !user.isEmailVerified ? SCREENS.VERIFY : apiKey ? SCREENS.HOME : SCREENS.ONBOARD,
      token: this.authService.getSignedToken(
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
}
