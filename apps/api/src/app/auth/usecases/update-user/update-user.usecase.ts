import { Injectable } from '@nestjs/common';
import { UserRepository } from '@impler/dal';
import { EMAIL_SUBJECT, UserRolesEnum } from '@impler/shared';
import { EmailService } from '@impler/services';
import { UpdateUserCommand } from './update-user.command';
import { AuthService } from 'app/auth/services/auth.service';
import { generateVerificationCode } from '@shared/helpers/common.helper';
import { UniqueEmailException } from '@shared/exceptions/unique-email.exception';

@Injectable()
export class UpdateUser {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
    private userRepository: UserRepository
  ) {}

  async execute(_userId: string, data: UpdateUserCommand) {
    if (data.email) {
      const userWithEmail = await this.userRepository.findOne({
        email: data.email,
        _id: { $ne: _userId },
      });
      if (userWithEmail) {
        throw new UniqueEmailException();
      }

      const newVerificationCode = generateVerificationCode();

      const user = await this.userRepository.findOneAndUpdate(
        { _id: _userId },
        { $set: { verificationCode: newVerificationCode, ...data } }
      );

      if (this.emailService.isConnected() && data.email) {
        // if email updated, send verification code
        const emailContents = this.emailService.getEmailContent({
          type: 'VERIFICATION_EMAIL',
          data: {
            otp: newVerificationCode,
            firstName: user.firstName,
          },
        });

        await this.emailService.sendEmail({
          to: user.email,
          subject: EMAIL_SUBJECT.VERIFICATION_CODE,
          html: emailContents,
          from: process.env.ALERT_EMAIL_FROM,
          senderName: process.env.EMAIL_FROM_NAME,
        });
      }

      const token = this.authService.getSignedToken({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as UserRolesEnum,
        isEmailVerified: user.isEmailVerified,
      });

      return { success: true, token };
    }

    return { success: true };
  }
}
