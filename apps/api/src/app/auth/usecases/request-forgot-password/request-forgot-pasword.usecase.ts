import { v4 as uuidv4 } from 'uuid';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { differenceInHours, differenceInSeconds, parseISO } from 'date-fns';

import { EmailService } from '@shared/services/email.service';
import { UserRepository, UserEntity, IUserResetTokenCount } from '@impler/dal';
import { RequestForgotPasswordCommand } from './request-forgot-pasword.command';

@Injectable()
export class RequestForgotPassword {
  private MAX_ATTEMPTS_IN_A_MINUTE = 5;
  private MAX_ATTEMPTS_IN_A_DAY = 15;
  private RATE_LIMIT_IN_SECONDS = 60;
  private RATE_LIMIT_IN_HOURS = 24;
  constructor(
    private emailService: EmailService,
    private userRepository: UserRepository
  ) {}

  async execute(command: RequestForgotPasswordCommand) {
    const user = await this.userRepository.findByEmail(command.email);
    if (user && user.email) {
      const { error, isBlocked } = this.isRequestBlocked(user);
      if (isBlocked) {
        throw new UnauthorizedException(error);
      }

      const token = uuidv4();
      const resetTokenCount = this.getUpdatedRequestCount(user);
      await this.userRepository.updatePasswordResetToken(user._id, token, resetTokenCount);

      const resetPasswordUrl = `${process.env.WEB_BASE_URL}/auth/reset/${token}`;
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

  private isRequestBlocked(user: UserEntity) {
    const lastResetAttempt = user.resetTokenDate;

    if (!lastResetAttempt) {
      return {
        isBlocked: false,
        error: '',
      };
    }
    const formattedDate = parseISO(lastResetAttempt);
    const diffSeconds = differenceInSeconds(new Date(), formattedDate);
    const diffHours = differenceInHours(new Date(), formattedDate);

    const withinDailyLimit = diffHours < this.RATE_LIMIT_IN_HOURS;
    const exceededDailyAttempt = user?.resetTokenCount
      ? user?.resetTokenCount?.reqInDay >= this.MAX_ATTEMPTS_IN_A_DAY
      : false;
    if (withinDailyLimit && exceededDailyAttempt) {
      return {
        isBlocked: true,
        error: `Too many requests, Try again after ${this.RATE_LIMIT_IN_HOURS} hours.`,
      };
    }

    const withinMinuteLimit = diffSeconds < this.RATE_LIMIT_IN_SECONDS;
    const exceededMinuteAttempt = user?.resetTokenCount
      ? user?.resetTokenCount?.reqInMinute >= this.MAX_ATTEMPTS_IN_A_MINUTE
      : false;
    if (withinMinuteLimit && exceededMinuteAttempt) {
      return {
        isBlocked: true,
        error: `Too many requests, Try again after a minute.`,
      };
    }

    return {
      isBlocked: false,
      error: '',
    };
  }

  private getUpdatedRequestCount(user: UserEntity): IUserResetTokenCount {
    const now = new Date().toISOString();
    const lastResetAttempt = user.resetTokenDate ?? now;
    const formattedDate = parseISO(lastResetAttempt);
    const diffSeconds = differenceInSeconds(new Date(), formattedDate);
    const diffHours = differenceInHours(new Date(), formattedDate);

    const resetTokenCount: IUserResetTokenCount = {
      reqInMinute: user.resetTokenCount?.reqInMinute ?? 0,
      reqInDay: user.resetTokenCount?.reqInDay ?? 0,
    };

    resetTokenCount.reqInMinute = diffSeconds < this.RATE_LIMIT_IN_SECONDS ? resetTokenCount.reqInMinute + 1 : 1;
    resetTokenCount.reqInDay = diffHours < this.RATE_LIMIT_IN_HOURS ? resetTokenCount.reqInDay + 1 : 1;

    return resetTokenCount;
  }
}
