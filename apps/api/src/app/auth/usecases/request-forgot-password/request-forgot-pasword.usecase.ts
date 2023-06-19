import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';

import { UserRepository } from '@impler/dal';
import { EmailService } from '@shared/services/email.service';
import { RequestForgotPasswordCommand } from './request-forgot-pasword.command';

@Injectable()
export class RequestForgotPassword {
  constructor(private emailService: EmailService, private userRepository: UserRepository) {}

  async execute(command: RequestForgotPasswordCommand) {
    const user = await this.userRepository.findByEmail(command.email);
    if (user) {
      const token = uuidv4();
      await this.userRepository.updatePasswordResetToken(user._id, token);

      const resetPasswordUrl = `${process.env.FRONT_BASE_URL}/auth/reset/${token}`;
      const resetPasswordContent = this.emailService.getEmailContent({
        type: 'REQUEST_FORGOT_PASSWORD',
        link: resetPasswordUrl,
      });
      this.emailService.sendEmail({
        to: user.email,
        from: process.env.EMAIL_FROM,
        html: resetPasswordContent,
        senderName: process.env.EMAIL_FROM_NAME,
        subject: 'Reset Password | Impler',
      });
    }

    return {
      success: true,
    };
  }
}
