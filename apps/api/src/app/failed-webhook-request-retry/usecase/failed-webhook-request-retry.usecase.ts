import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { QueuesEnum } from '@impler/shared';
import { QueueService } from '@shared/services/queue.service';
import { FailedWebhookRetryRequestsEntity, FailedWebhookRetryRequestsRepository } from '@impler/dal';

@Injectable()
export class FailedWebhookRetry {
  constructor(
    private failedWebhookRetryRequestsRepository: FailedWebhookRetryRequestsRepository = new FailedWebhookRetryRequestsRepository(),
    private queueService: QueueService
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async processWebhookRetries() {
    try {
      const failedWebhooks: FailedWebhookRetryRequestsEntity[] = await this.failedWebhookRetryRequestsRepository.find({
        nextRequestTime: { $lt: new Date() },
      });

      if (!failedWebhooks.length) {
        return;
      }

      await Promise.allSettled(failedWebhooks.map((wbh) => this.processWebhook(wbh)));
    } catch (error) {
      throw error;
    }
  }

  private async processWebhook(webhook: FailedWebhookRetryRequestsEntity) {
    try {
      this.queueService.publishToQueue(QueuesEnum.SEND_FAILED_WEBHOOK_DATA, webhook._id as string);
    } catch (error) {
      throw error;
    }
  }
}
