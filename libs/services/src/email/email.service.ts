import * as nodemailer from 'nodemailer';
import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';

interface IWebhookAlertEmailOptions {
  importName: string;
  webhookUrl: string;
  time: string;
  error: JSON;
}
interface IBubbleAlertEmailOptions {
  datatype: string;
  environment: string;
  url: string;
  error: string;
  importName: string;
  time: string;
}
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
  ERROR_SENDING_WEBHOOK_DATA: ({ importName, webhookUrl, time, error }: IWebhookAlertEmailOptions) => `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error Sending Data</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #d9534f;
        }
        .error-log {
            background-color: #f9f2f4;
            border: 1px solid #c9302c;
            border-radius: 4px;
            padding: 10px;
            font-family: monospace;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .details {
            margin-top: 20px;
        }
        .details p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <h1>⚠️ Error while sending data via webhook</h1>
    
    <p>An error occurred while sending data to your webhook. Please find the details below:</p>
    
    <div class="details">
        <p><strong>Import Name:</strong> ${importName}</p>
        <p><strong>Webhook Url:</strong> ${webhookUrl}</p>
        <p><strong>Time of Error:</strong> ${time}</p>
    </div>
    
    <h2>Error Log:</h2>
    <div class="error-log">
    ${error}
    </div>
    
    <p>Please review the error log and take necessary actions to resolve the issue. If you need assistance, please contact our support team.</p>
    
    <p>Thank you for your attention to this matter.</p>
    
    <p>Best regards,<br>Impler</p>
</body>
</html>
  `,
  ERROR_SENDING_BUBBLE_DATA: ({ datatype, environment, error, importName, time, url }: IBubbleAlertEmailOptions) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error Sending Data</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #d9534f;
        }
        .error-log {
            background-color: #f9f2f4;
            border: 1px solid #c9302c;
            border-radius: 4px;
            padding: 10px;
            font-family: monospace;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .details {
            margin-top: 20px;
        }
        .details p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <h1>⚠️ </h1>
    
    <p>An error occurred while sending data to Bubble. Please find the details below:</p>
    
    <div class="details">
        <p><strong>Import Name:</strong> ${importName}</p>
        <p><strong>URL:</strong> ${url}</p>
        <p><strong>Data Type:</strong> ${datatype}</p>
        <p><strong>Environment:</strong> ${environment}</p>
        <p><strong>Error:</strong> ${error}</p>
        <p><strong>Time of Error:</strong> ${time}</p>
    </div>
    
    <h2>Error Log:</h2>
    <div class="error-log">
    ${error}
    </div>
    
    <p>Please review the error log and take necessary actions to resolve the issue. If you need assistance, please contact our support team.</p>
    
    <p>Thank you for your attention to this matter.</p>
    
    <p>Best regards,<br>Impler</p>
</body>
</html>
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
