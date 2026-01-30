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
    const startTime = new Date();
    const memUsageStart = process.memoryUsage();
    const cpuUsageStart = process.cpuUsage();
    
    console.log('========================================');
    console.log(`[FAILED-WEBHOOK-RETRY] Cron Started at ${startTime.toISOString()}`);
    console.log(`[FAILED-WEBHOOK-RETRY] Memory Usage (Start): RSS=${(memUsageStart.rss / 1024 / 1024).toFixed(2)}MB, Heap=${(memUsageStart.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    console.log('========================================');
    
    try {
      const failedWebhooks: FailedWebhookRetryRequestsEntity[] = await this.failedWebhookRetryRequestsRepository.find({
        nextRequestTime: { $lt: new Date() },
      });

      console.log(`[FAILED-WEBHOOK-RETRY] Found ${failedWebhooks.length} failed webhooks to retry`);

      if (!failedWebhooks.length) {
        console.log(`[FAILED-WEBHOOK-RETRY] No webhooks to process, exiting`);
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
      
      console.log('========================================');
      console.log(`[FAILED-WEBHOOK-RETRY] Cron Completed at ${endTime.toISOString()}`);
      console.log(`[FAILED-WEBHOOK-RETRY] Results - Successful: ${successful}, Failed: ${failed}, Total: ${failedWebhooks.length}`);
      console.log(`[FAILED-WEBHOOK-RETRY] Processing Duration: ${processDuration}ms`);
      console.log(`[FAILED-WEBHOOK-RETRY] Total Duration: ${duration}ms`);
      console.log(`[FAILED-WEBHOOK-RETRY] Memory Usage (End): RSS=${(memUsageEnd.rss / 1024 / 1024).toFixed(2)}MB, Heap=${(memUsageEnd.heapUsed / 1024 / 1024).toFixed(2)}MB`);
      console.log(`[FAILED-WEBHOOK-RETRY] Memory Delta: RSS=${((memUsageEnd.rss - memUsageStart.rss) / 1024 / 1024).toFixed(2)}MB, Heap=${((memUsageEnd.heapUsed - memUsageStart.heapUsed) / 1024 / 1024).toFixed(2)}MB`);
      console.log(`[FAILED-WEBHOOK-RETRY] CPU Usage: User=${(cpuUsageEnd.user / 1000).toFixed(2)}ms, System=${(cpuUsageEnd.system / 1000).toFixed(2)}ms`);
      
      if (duration > 5000) {
        console.warn(`[FAILED-WEBHOOK-RETRY] ⚠️ WARNING: Cron execution took ${duration}ms (>5s threshold)`);
      }
      
      if (failedWebhooks.length > 100) {
        console.warn(`[FAILED-WEBHOOK-RETRY] ⚠️ WARNING: Processing large batch of ${failedWebhooks.length} webhooks`);
      }
      
      console.log('========================================');
    } catch (error) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      console.error('========================================');
      console.error(`[FAILED-WEBHOOK-RETRY] ❌ ERROR at ${endTime.toISOString()}`);
      console.error(`[FAILED-WEBHOOK-RETRY] Duration before error: ${duration}ms`);
      console.error('[FAILED-WEBHOOK-RETRY] Error details:', error);
      console.error('========================================');
      throw error;
    }
  }

  private async processWebhook(webhook: FailedWebhookRetryRequestsEntity) {
    const webhookStartTime = Date.now();
    try {
      console.log(`[FAILED-WEBHOOK-RETRY] Processing webhook - ID: ${webhook._id}, Time: ${new Date().toISOString()}`);
      
      this.queueService.publishToQueue(QueuesEnum.SEND_FAILED_WEBHOOK_DATA, webhook._id as string);
      
      const webhookDuration = Date.now() - webhookStartTime;
      console.log(`[FAILED-WEBHOOK-RETRY] Webhook queued - ID: ${webhook._id}, Duration: ${webhookDuration}ms`);
    } catch (error) {
      const webhookDuration = Date.now() - webhookStartTime;
      console.error(`[FAILED-WEBHOOK-RETRY] ❌ Error processing webhook - ID: ${webhook._id}, Duration: ${webhookDuration}ms, Time: ${new Date().toISOString()}`, error);
      throw error;
    }
  }
}
