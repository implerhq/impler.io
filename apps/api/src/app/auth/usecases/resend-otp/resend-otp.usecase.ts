import { Injectable } from '@nestjs/common';
import { EmailService } from '@impler/services';
import { UserRepository } from '@impler/dal';
import { EMAIL_SUBJECT } from '@impler/shared';
import { generateVerificationCode } from '@shared/helpers/common.helper';

@Injectable()
export class ResendOTP {
  constructor(
    private emailService: EmailService,
    private userRepository: UserRepository
  ) {}

  async execute(_userId: string) {
    const newVerificationCode = generateVerificationCode();

    const user = await this.userRepository.findOneAndUpdate(
      { _id: _userId },
      { $set: { verificationCode: newVerificationCode } }
    );

    if (this.emailService.isConnected()) {
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

    return { success: true };
  }
}
