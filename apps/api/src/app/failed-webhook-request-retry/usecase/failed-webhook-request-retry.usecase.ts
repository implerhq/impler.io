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

  @Cron(CronExpression.EVERY_5_MINUTES)
  async processWebhookRetries() {
    const startTime = new Date();
    const memUsageStart = process.memoryUsage();
    const cpuUsageStart = process.cpuUsage();
    
    this.logger.log('========================================');
    this.logger.log(`[FAILED-WEBHOOK-RETRY] Cron Started at ${startTime.toISOString()}`);
    this.logger.log(`[FAILED-WEBHOOK-RETRY] Memory Usage (Start): RSS=${(memUsageStart.rss / 1024 / 1024).toFixed(2)}MB, Heap=${(memUsageStart.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    this.logger.log('========================================');
    
    try {
      const failedWebhooks: FailedWebhookRetryRequestsEntity[] = await this.failedWebhookRetryRequestsRepository.find({
        nextRequestTime: { $lt: new Date() },
      });

      this.logger.log(`[FAILED-WEBHOOK-RETRY] Found ${failedWebhooks.length} failed webhooks to retry`);

      if (!failedWebhooks.length) {
        this.logger.log(`[FAILED-WEBHOOK-RETRY] No webhooks to process, exiting`);
        return;
      }

      const processStartTime = Date.now();
      const results = await Promise.allSettled(failedWebhooks.map((wbh) => this.processWebhook(wbh)));
      const processDuration = Date.now() - processStartTime;
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      const memUsageEnd = process.memoryUsage();
      const cpuUsageEnd = process.cpuUsage(cpuUsageStart);
      
      this.logger.log('========================================');
      this.logger.log(`[FAILED-WEBHOOK-RETRY] Cron Completed at ${endTime.toISOString()}`);
      this.logger.log(`[FAILED-WEBHOOK-RETRY] Results - Successful: ${successful}, Failed: ${failed}, Total: ${failedWebhooks.length}`);
      this.logger.log(`[FAILED-WEBHOOK-RETRY] Processing Duration: ${processDuration}ms`);
      this.logger.log(`[FAILED-WEBHOOK-RETRY] Total Duration: ${duration}ms`);
      this.logger.log(`[FAILED-WEBHOOK-RETRY] Memory Usage (End): RSS=${(memUsageEnd.rss / 1024 / 1024).toFixed(2)}MB, Heap=${(memUsageEnd.heapUsed / 1024 / 1024).toFixed(2)}MB`);
      this.logger.log(`[FAILED-WEBHOOK-RETRY] Memory Delta: RSS=${((memUsageEnd.rss - memUsageStart.rss) / 1024 / 1024).toFixed(2)}MB, Heap=${((memUsageEnd.heapUsed - memUsageStart.heapUsed) / 1024 / 1024).toFixed(2)}MB`);
      this.logger.log(`[FAILED-WEBHOOK-RETRY] CPU Usage: User=${(cpuUsageEnd.user / 1000).toFixed(2)}ms, System=${(cpuUsageEnd.system / 1000).toFixed(2)}ms`);
      
      if (duration > 5000) {
        this.logger.warn(`[FAILED-WEBHOOK-RETRY] ⚠️ WARNING: Cron execution took ${duration}ms (>5s threshold)`);
      }
      
      if (failedWebhooks.length > 100) {
        this.logger.warn(`[FAILED-WEBHOOK-RETRY] ⚠️ WARNING: Processing large batch of ${failedWebhooks.length} webhooks`);
      }
      
      this.logger.log('========================================');
    } catch (error) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      this.logger.error('========================================');
      this.logger.error(`[FAILED-WEBHOOK-RETRY] ❌ ERROR at ${endTime.toISOString()}`);
      this.logger.error(`[FAILED-WEBHOOK-RETRY] Duration before error: ${duration}ms`);
      this.logger.error('[FAILED-WEBHOOK-RETRY] Error details:', error);
      this.logger.error('========================================');
      throw error;
    }
  }

  private async processWebhook(webhook: FailedWebhookRetryRequestsEntity) {
    const webhookStartTime = Date.now();
    try {
      this.logger.log(`[FAILED-WEBHOOK-RETRY] Processing webhook - ID: ${webhook._id}, Time: ${new Date().toISOString()}`);
      
      this.queueService.publishToQueue(QueuesEnum.SEND_FAILED_WEBHOOK_DATA, webhook._id as string);
      
      const webhookDuration = Date.now() - webhookStartTime;
      this.logger.log(`[FAILED-WEBHOOK-RETRY] Webhook queued - ID: ${webhook._id}, Duration: ${webhookDuration}ms`);
    } catch (error) {
      const webhookDuration = Date.now() - webhookStartTime;
      this.logger.error(`[FAILED-WEBHOOK-RETRY] ❌ Error processing webhook - ID: ${webhook._id}, Duration: ${webhookDuration}ms, Time: ${new Date().toISOString()}`, error);
      throw error;
    }
  }
}
