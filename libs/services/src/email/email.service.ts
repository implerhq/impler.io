import * as nodemailer from 'nodemailer';
import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';

interface IWebhookAlertEmailOptions {
  importName: string;
  webhookUrl: string;
  time: string;
  error: string;
  importId: string;
}
interface IBubbleAlertEmailOptions {
  datatype: string;
  environment: string;
  url: string;
  error: string;
  importName: string;
  time: string;
  importId: string;
}
interface IExecutionErrorEmailOptions {
  error: string;
  importName: string;
  time: string;
  importId: string;
}
interface ISendMailOptions {
  to: string;
  from: string;
  html: string;
  subject: string;
  senderName: string;
}
interface IForgotPasswordEmailOptions {
  link: string;
}
interface IVerificationEmailOptions {
  otp: string;
  firstName: string;
}

interface IProjectInvitationEmailOptions {
  invitedBy: string;
  projectName: string;
  invitationUrl: string;
}
interface IAcceptProjectInvitationSenderEmailOptions {
  invitedBy: string;
  projectName: string;
  acceptedBy: string;
}

interface IAcceptProjectInvitationRecieverEmailOptions {
  invitedBy: string;
  projectName: string;
  acceptedBy: string;
}

interface IDeclineInvitationEmailOptions {
  invitedBy: string;
  projectName: string;
  declinedBy: string;
}

const EMAIL_CONTENTS = {
  VERIFICATION_EMAIL: ({ otp, firstName }: IVerificationEmailOptions) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 20px;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
              text-align: center;
              margin-bottom: 20px;
          }
          .header img {
              width: 150px;
              margin-bottom: 10px;
          }
          .header h1 {
              font-size: 24px;
              color: white;
          }
          .content {
              color: #555;
              line-height: 1.6;
          }
          .otp-code {
              display: inline-block;
              font-size: 24px;
              font-weight: bold;
              color: #4caf50;
              background-color: #e8f5e9;
              padding: 5px 10px;
              border-radius: 4px;
              margin: 10px 0;
          }
          .footer {
              margin-top: 20px;
              text-align: center;
              color: #777;
          }
          .footer a {
              color: #1e88e5;
              text-decoration: none;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <img src="https://impler.io/wp-content/uploads/2024/07/Logo-black.png" alt="Impler Logo" />
              <h1>Verification Code</h1>
          </div>
          
          <div class="content">
              <p>Hi ${firstName},</p>
              <p>Your OTP code is <span class="otp-code">${otp}</span>. Please enter this code to verify your identity.</p>
              <p>If you did not request this code, please ignore this email.</p>
              <p>Thank you,</p>
              <p>The Impler Team</p>
          </div>
          
          <div class="footer">
              <p>If you need help, feel free to <a href="mailto:bhavik@impler.io">contact us</a>.</p>
          </div>
      </div>
  </body>
  </html>
    `,

  REQUEST_FORGOT_PASSWORD: ({ link }: IForgotPasswordEmailOptions) => `
		<p>Hi,</p>
		<p>You have requested to reset your password. Please click on the link below to reset your password.</p>
		<p><a href="${link}">
			Reset Password
		</a></p>
		<p>If you did not request to reset your password, please ignore this email.</p>
		<p>Thanks,</p>
		<p>Impler Team</p>
	`,
  ERROR_SENDING_WEBHOOK_DATA: ({ importName, webhookUrl, time, importId, error }: IWebhookAlertEmailOptions) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
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
        .logo {
            color: #333;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .logo span {
            color: purple;
        }
        h1 {
            color: #333;
            font-size: 20px;
        }
        p, ul {
            color: #555;
            line-height: 1.6;
        }
        ul {
            padding-left: 20px;
        }
        .details {
            margin-top: 20px;
        }
        .contact {
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo"><img src="https://impler.io/wp-content/uploads/2024/07/Logo-black.png" style="width: 150px;" alt="Impler Logo" /></div>
        
        <h1>Encountered error while sending webhook data in ${importName} import</h1>
        
        <p>Your import ${importName} webhook has encountered an error.</p>
        
        <p>Impler has failed to send data the webhook you provided in ${importName} import. You should pay attention to the issue.</p>
        
        <ul>
            <li><strong>Import Name:</strong> ${importName}</li>
            <li><strong>Webhook Url:</strong> ${webhookUrl}</li>
            <li><strong>Time:</strong> ${time}</li>
            <li><strong>Import Id:</strong> ${importId}</li>
        </ul>
        
        <div class="details">
            <p><strong>Error Details:<strong></p>
            <div class="error-log">${error}</div>
        </div>
        
        <div class="contact">
            <p>Need any help? <a href="mailto:bhavik@impler.io">Contact us</a></p>
        </div>
    </div>
</body>
</html>
  `,
  ERROR_SENDING_BUBBLE_DATA: ({
    datatype,
    environment,
    error,
    importName,
    time,
    url,
    importId,
  }: IBubbleAlertEmailOptions) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 20px;
      }
      .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          padding: 30px;
          border-radius: 8px;
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
      .logo {
          color: #333;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
      }
      .logo span {
          color: purple;
      }
      h1 {
          color: #333;
          font-size: 20px;
      }
      p, ul {
          color: #555;
          line-height: 1.6;
      }
      ul {
          padding-left: 20px;
      }
      .details {
          margin-top: 20px;
      }
      .contact {
          margin-top: 30px;
      }
    </style>
</head>
<body>
    <div class="container">
      <div class="logo"><img src="https://impler.io/wp-content/uploads/2024/07/Logo-black.png" style="width: 150px;" alt="Impler Logo" /></div>
      
      <h1>Encountered error while sending webhook data in ${importName} import</h1>
      
      <p>Your import ${importName} webhook has encountered an error.</p>
      
      <p>Impler has failed to send data to Bubble.io in ${importName} import. You should pay attention to the issue.</p>

      <ul>
        <li><strong>Import Name:</strong> ${importName}</li>
        <li><strong>URL:</strong> ${url}</li>
        <li><strong>Data Type:</strong> ${datatype}</li>
        <li><strong>Environment:</strong> ${environment}</li>
        <li><strong>Import Id:</strong> ${importId}</li>
        <li><strong>Time of Error:</strong> ${time}</li>
      </ul>
      
      <div class="details">
          <p><strong>Error Details:<strong></p>
          <div class="error-log">${error}</div>
      </div>
      
      <div class="contact">
          <p>Need any help? <a href="mailto:bhavik@impler.io">Contact us</a></p>
      </div>
</body>
</html>
  `,
  ERROR_EXECUTING_CODE: ({ error, importName, time, importId }: IExecutionErrorEmailOptions) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 20px;
      }
      .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          padding: 30px;
          border-radius: 8px;
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
      .logo {
          color: #333;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
      }
      .logo span {
          color: purple;
      }
      h1 {
          color: #333;
          font-size: 20px;
      }
      p, ul {
          color: #555;
          line-height: 1.6;
      }
      ul {
          padding-left: 20px;
      }
      .details {
          margin-top: 20px;
      }
      .contact {
          margin-top: 30px;
      }
    </style>
</head>
<body>
    <div class="container">
      <div class="logo"><img src="https://impler.io/wp-content/uploads/2024/07/Logo-black.png" style="width: 150px;" alt="Impler Logo" /></div>
      
      <h1>Encountered error while executing validation code in ${importName} import</h1>
      
      <p>Validation code was failed to execute due to some error. You should pay attention to the issue.</p>

      <ul>
        <li><strong>Import Name:</strong> ${importName}</li>
        <li><strong>Import Id:</strong> ${importId}</li>
        <li><strong>Time of Error:</strong> ${time}</li>
      </ul>
      
      <div class="details">
          <p><strong>Error Details:<strong></p>
          <div class="error-log">${error}</div>
      </div>
      
      <div class="contact">
          <p>Need any help? <a href="mailto:bhavik@impler.io">Contact us</a></p>
      </div>
</body>
</html>
`,

  PROJECT_INVITATION_EMAIL: ({ invitedBy, projectName, invitationUrl }: IProjectInvitationEmailOptions) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 20px;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
              text-align: center;
              margin-bottom: 20px;
          }
          .header h1 {
              font-size: 24px;
              color: #333;
          }
          .content {
              color: #555;
              line-height: 1.6;
          }
          .button-container {
              text-align: center;
              margin-top: 20px;
          }
          .button {
              background-color: #4caf50;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
          }
          .footer {
              margin-top: 20px;
              text-align: center;
              color: #777;
          }
          .centered-text {
              text-align: center;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>${invitedBy} invited you to join the project <b>"${projectName}"</b></h1>
          </div>
          
          <div class="content">
            <p>Hello</p>
              <p>You have been invited to join the project <strong>${projectName}</strong>. Please click the button below to accept the invitation.</p>
              
              <div class="button-container">
                  <a href="${invitationUrl}" class="button">Accept Invitation</a>
              </div>
              
          </div>
       <p class="centered-text">If you don't know about this request, please ignore this email.</p>   
      </div>
  </body>
  </html>`,

  ACCEPT_PROJECT_INVITATION_SENDER_EMAIL: ({
    invitedBy,
    projectName,
    acceptedBy,
  }: IAcceptProjectInvitationSenderEmailOptions) =>
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
        }
        .logo {
            color: #333;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .logo span {
            color: purple;
        }
        h1 {
            color: #333;
            font-size: 20px;
        }
        p, ul {
            color: #555;
            line-height: 1.6;
        }
        ul {
            padding-left: 20px;
        }
        
        .contact {
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo"><img src="https://impler.io/wp-content/uploads/2024/07/Logo-black.png" style="width: 150px;" alt="Impler Logo" /></div>
        <h1>Project Invitation Accepted: ${projectName}</h1>
        <p>${acceptedBy} has accepted the invitation to join the project.</p>
        <ul>
            <li><strong>Project Name:</strong> ${projectName}</li>
            <li><strong>Invited By:</strong> ${invitedBy}</li>
            <li><strong>Accepted By:</strong> ${acceptedBy}</li>
        </ul>
       
        <div class="contact">
            <p>Need any help? <a href="mailto:support@impler.io">Contact us</a></p>
        </div>
    </div>
</body>
</html>`,

  ACCEPT_PROJECT_INVITATION_RECIEVER_EMAIL: ({
    invitedBy,
    projectName,
    acceptedBy,
  }: IAcceptProjectInvitationRecieverEmailOptions) =>
    `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 20px;
    }
    .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: white;
        padding: 30px;
        border-radius: 8px;
    }
    .logo {
        color: #333;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
    }
    .logo span {
        color: purple;
    }
    h1 {
        color: #333;
        font-size: 20px;
    }
    p, ul {
        color: #555;
        line-height: 1.6;
    }
    ul {
        padding-left: 20px;
    }
    
    .contact {
        margin-top: 30px;
    }
</style>
</head>
<body>
<div class="container">
    <div class="logo"><img src="https://impler.io/wp-content/uploads/2024/07/Logo-black.png" style="width: 150px;" alt="Impler Logo" /></div>
    <h1>Project Invitation Accepted: ${projectName}</h1>
    <p>You have Successfully join the project.</p>
    <ul>
        <li><strong>Project Name:</strong> ${projectName}</li>
        <li><strong>Invited By:</strong> ${invitedBy}</li>
        <li><strong>Accepted By:</strong> ${acceptedBy}</li>
    </ul>
   
    <div class="contact">
        <p>Need any help? <a href="mailto:support@impler.io">Contact us</a></p>
    </div>
</div>
</body>
</html>`,
  DECLINE_INVITATION_EMAIL: ({ invitedBy, projectName, declinedBy }: IDeclineInvitationEmailOptions) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
        }
        .logo {
            color: #333;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .logo span {
            color: purple;
        }
        h1 {
            color: #333;
            font-size: 20px;
        }
        p, ul {
            color: #555;
            line-height: 1.6;
        }
        ul {
            padding-left: 20px;
        }
        
        .contact {
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo"><img src="https://impler.io/wp-content/uploads/2024/07/Logo-black.png" style="width: 150px;" alt="Impler Logo" /></div>
        <h1>Project Invitation Declined: ${projectName}</h1>
        <p>${declinedBy} has declined the invitation to join the project.</p>
        <ul>
            <li><strong>Project Name:</strong> ${projectName}</li>
            <li><strong>Invited By:</strong> ${invitedBy}</li>
            <li><strong>Declined By:</strong> ${declinedBy}</li>
        </ul>
        
        <div class="contact">
            <p>Need any help? <a href="mailto:support@impler.io">Contact us</a></p>
        </div>
    </div>
</body>
</html>`,
};

type EmailContents =
  | {
      type: 'REQUEST_FORGOT_PASSWORD';
      data: IForgotPasswordEmailOptions;
    }
  | {
      type: 'ERROR_SENDING_WEBHOOK_DATA';
      data: IWebhookAlertEmailOptions;
    }
  | {
      type: 'ERROR_SENDING_BUBBLE_DATA';
      data: IBubbleAlertEmailOptions;
    }
  | {
      type: 'ERROR_EXECUTING_CODE';
      data: IExecutionErrorEmailOptions;
    }
  | {
      type: 'VERIFICATION_EMAIL';
      data: IVerificationEmailOptions;
    }
  | {
      type: 'PROJECT_INVITATION_EMAIL';
      data: IProjectInvitationEmailOptions;
    }
  | {
      type: 'ACCEPT_PROJECT_INVITATION_SENDER_EMAIL';
      data: IAcceptProjectInvitationSenderEmailOptions;
    }
  | {
      type: 'ACCEPT_PROJECT_INVITATION_RECIEVER_EMAIL';
      data: IAcceptProjectInvitationRecieverEmailOptions;
    }
  | {
      type: 'DECLINE_INVITATION_EMAIL';
      data: IDeclineInvitationEmailOptions;
    };

export abstract class EmailService {
  abstract sendEmail(data: ISendMailOptions): Promise<{ messageId: string }>;
  abstract isConnected(): boolean;
  getEmailContent({ type, data }: EmailContents) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return EMAIL_CONTENTS[type](data);
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
