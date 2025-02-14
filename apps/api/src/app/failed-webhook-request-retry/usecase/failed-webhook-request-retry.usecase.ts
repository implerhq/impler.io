import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { QueuesEnum } from '@impler/shared';
import { QueueService } from '@shared/services/queue.service';
import { FailedWebhookRetryRequestsEntity, FailedWebhookRetryRequestsRepository } from '@impler/dal';

@Injectable()
export class FailedWebhookRetry {
  private readonly logger = new Logger(FailedWebhookRetry.name);

  constructor(
    private failedWebhookRetryRequestsRepository: FailedWebhookRetryRequestsRepository = new FailedWebhookRetryRequestsRepository(),
    private queueService: QueueService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async processWebhookRetries() {
    try {
      const failedWebhooks = await this.failedWebhookRetryRequestsRepository.find({
        nextRequestTime: { $lt: new Date() },
      });

      if (!failedWebhooks.length) {
        return;
      }

      await Promise.allSettled(failedWebhooks.map(this.processWebhook));
    } catch (error) {
      throw error;
    }
  }

  private async processWebhook(webhook: FailedWebhookRetryRequestsEntity) {
    try {
      this.queueService.publishToQueue(QueuesEnum.SEND_FAILED_WEBHOOK_DATA, webhook._id);
    } catch (error) {
      throw error;
    }
  }
}
