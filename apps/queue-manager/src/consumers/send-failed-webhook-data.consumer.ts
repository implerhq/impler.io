import { BaseConsumer } from './base.consumer';
import { EMAIL_SUBJECT, ISendDataParameters, StatusEnum } from '@impler/shared';
import { FailedWebhookRetryRequestsRepository, UploadRepository, WebhookLogRepository } from '@impler/dal';
import { EmailService } from '@impler/services';
import { getEmailServiceClass } from '../helpers/services.helper';
import { Defaults } from '@impler/shared';
import dayjs from 'dayjs';

export class SendFailedWebhookDataConsumer extends BaseConsumer {
  private webhookLogRepository: WebhookLogRepository = new WebhookLogRepository();
  private failedWebhookRetryRequestsRepository: FailedWebhookRetryRequestsRepository =
    new FailedWebhookRetryRequestsRepository();
  private emailService: EmailService = getEmailServiceClass();
  private uploadRepository: UploadRepository = new UploadRepository();

  async message(message: { content: string }): Promise<void> {
    const fetchedId = JSON.parse(message.content);
    const apiData = await this.failedWebhookRetryRequestsRepository.findOne({ _id: fetchedId });
    const response = await this.makeApiCall(apiData.dataContent as unknown as ISendDataParameters);

    if (response.status === StatusEnum.FAILED && apiData.retryCount > 1) {
      const createdRetryRequest = await this.failedWebhookRetryRequestsRepository.create({
        _webhookLogId: apiData._webhookLogId,
        dataContent: apiData.dataContent,
        retryCount: apiData.retryCount - 1,
        retryInterval: apiData.retryInterval,
        nextRequestTime: this.getNextTime(1).toDate(),
      });

      const userEmail = await this.uploadRepository.getUserEmailFromUploadId(
        (apiData.dataContent as unknown as ISendDataParameters).uploadId
      );

      const emailContents = this.emailService.getEmailContent({
        type: 'ERROR_SENDING_WEBHOOK_DATA',
        data: {
          error: JSON.stringify(response.error, null, 2),
          importName: apiData.importName,
          time: dayjs().format(Defaults.DATE_FORMAT),
          webhookUrl: (apiData.dataContent as unknown as ISendDataParameters).url,
          importId: createdRetryRequest._uploadId,
        },
      });

      await this.emailService.sendEmail({
        to: userEmail,
        subject: `${EMAIL_SUBJECT.ERROR_SENDING_WEBHOOK_DATA} ${apiData.importName}`,
        html: emailContents,
        from: process.env.ALERT_EMAIL_FROM,
        senderName: process.env.EMAIL_FROM_NAME,
      });
    }

    await this.webhookLogRepository.create({
      ...response,
      headersContent: (apiData.dataContent as unknown as ISendDataParameters)?.headers,
      _uploadId: response._uploadId,
      failedReason: response.failedReason,
      responseStatusCode: response.responseStatusCode,
      pageNumber: response.pageNumber,
      callDate: new Date(),
      status: response.status,
    });

    await this.failedWebhookRetryRequestsRepository.delete({ _id: fetchedId });
  }
}
