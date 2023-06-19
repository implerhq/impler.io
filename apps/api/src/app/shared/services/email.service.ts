import * as nodemailer from 'nodemailer';
import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';

interface ISendMailOptions {
  to: string;
  from: string;
  html: string;
  subject: string;
  senderName: string;
}

const EMAIL_CONTENT = {
  REQUEST_FORGOT_PASSWORD: ({ link }: { link: string }) => `
		<p>Hi,</p>
		<p>You have requested to reset your password. Please click on the link below to reset your password.</p>
		<p><a href="${link}">
			Reset Password
		</a></p>
		<p>If you did not request to reset your password, please ignore this email.</p>
		<p>Thanks,</p>
		<p>Impler Team</p>
	`,
};

type EmailContents = {
  type: 'REQUEST_FORGOT_PASSWORD';
  link: string;
};

export abstract class EmailService {
  abstract sendEmail(data: ISendMailOptions): Promise<{ messageId: string }>;
  abstract isConnected(): boolean;
  getEmailContent({ type, ...args }: EmailContents) {
    return EMAIL_CONTENT[type](args);
  }
}

export class SESEmailService extends EmailService {
  private readonly ses: SESClient;
  constructor() {
    super();
    if (process.env.SES_REGION && process.env.SES_ACCESS_KEY_ID && process.env.SES_SECRET_ACCESS_KEY)
      this.ses = new SESClient({
        region: process.env.SES_REGION,
        credentials: {
          accessKeyId: process.env.SES_ACCESS_KEY_ID,
          secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
        },
      });
  }
  async sendEmail({ to, subject, html, from, senderName }: ISendMailOptions) {
    if (!this.isConnected()) return;

    const transporter = nodemailer.createTransport({
      SES: { ses: this.ses, aws: { SendRawEmailCommand } },
    });

    const response = await transporter.sendMail({
      to,
      html,
      subject,
      from: {
        address: from,
        name: senderName,
      },
    });

    return {
      messageId: response.messageId,
    };
  }
  isConnected(): boolean {
    return !!this.ses;
  }
}
