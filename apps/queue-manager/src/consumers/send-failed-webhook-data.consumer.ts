import { BaseConsumer } from './base.consumer';
import { ISendDataParameters, StatusEnum } from '@impler/shared';
import { FailedWebhookRetryRequestsRepository, WebhookLogRepository } from '@impler/dal';

export class SendFailedWebhookDataConsumer extends BaseConsumer {
  private webhookLogRepository: WebhookLogRepository = new WebhookLogRepository();
  private failedWebhookRetryRequestsRepository: FailedWebhookRetryRequestsRepository =
    new FailedWebhookRetryRequestsRepository();

  async message(message: { content: string }): Promise<void> {
    const fetchedId = JSON.parse(message.content);
    const apiData = await this.failedWebhookRetryRequestsRepository.findOne({ _id: fetchedId });
    console.log(fetchedId, apiData);
    const response = await this.makeApiCall(apiData.dataContent as unknown as ISendDataParameters);

    if (response.status === StatusEnum.FAILED && apiData.retryCount > 1) {
      await this.failedWebhookRetryRequestsRepository.create({
        _webhookLogId: apiData._webhookLogId,
        dataContent: apiData.dataContent,
        retryCount: apiData.retryCount - 1,
        retryInterval: apiData.retryInterval,
        nextRequestTime: this.getNextTime(1).toDate(),
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
