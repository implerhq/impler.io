import * as bcrypt from 'bcryptjs';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

import { EmailService } from '@impler/services';
import { LoginUserCommand } from './login-user.command';
import { AuthService } from '../../services/auth.service';
import { EnvironmentRepository, UserRepository } from '@impler/dal';
import { EMAIL_SUBJECT, SCREENS } from '@impler/shared';
import { generateVerificationCode } from '@shared/helpers/common.helper';

@Injectable()
export class LoginUser {
  constructor(
    private authService: AuthService,
    private userRepository: UserRepository,
    private environmentRepository: EnvironmentRepository,
    private emailService: EmailService
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
    if (!user.isEmailVerified) {
      const verificationCode = generateVerificationCode();
      const emailContents = this.emailService.getEmailContent({
        type: 'VERIFICATION_EMAIL',
        data: {
          otp: verificationCode,
          firstName: user.firstName,
        },
      });

      await this.emailService.sendEmail({
        to: command.email,
        subject: EMAIL_SUBJECT.VERIFICATION_CODE,
        html: emailContents,
        from: process.env.ALERT_EMAIL_FROM,
        senderName: process.env.EMAIL_FROM_NAME,
      });

      this.userRepository.update(
        { _id: user._id },
        {
          ...user,
          verificationCode,
        }
      );
    }

    const apiKey = await this.environmentRepository.getApiKeyForUserId(user._id);

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
