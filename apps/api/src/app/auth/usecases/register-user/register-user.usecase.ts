import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';

import { UserRepository } from '@impler/dal';
import { generateVerificationCode } from '@impler/shared';
import { EmailService } from '@impler/services';
import { AuthService } from '../../services/auth.service';
import { RegisterUserCommand } from './register-user.command';
import { LEAD_SIGNUP_USING } from '@shared/constants';
import { SCREENS, EMAIL_SUBJECT } from '@impler/shared';
import { UniqueEmailException } from '@shared/exceptions/unique-email.exception';

@Injectable()
export class RegisterUser {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
    private userRepository: UserRepository
  ) {}

  async execute(command: RegisterUserCommand) {
    const userWithEmail = await this.userRepository.findOne({
      email: command.email,
    });
    if (userWithEmail) {
      throw new UniqueEmailException();
    }

    const passwordHash = await bcrypt.hash(command.password, 10);
    const verificationCode = generateVerificationCode();

    const user = await this.userRepository.create({
      email: command.email,
      firstName: command.firstName.toLowerCase(),
      lastName: command.lastName?.toLowerCase(),
      password: passwordHash,
      signupMethod: LEAD_SIGNUP_USING.EMAIL,
      verificationCode,
      isEmailVerified: this.emailService.isConnected() ? false : true,
    });

    const token = this.authService.getSignedToken({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    if (this.emailService.isConnected()) {
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

      return {
        screen: SCREENS.VERIFY,
        token,
      };
    }

    return {
      screen: SCREENS.ONBOARD,
      token,
    };
  }
}
