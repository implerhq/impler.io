import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { QueueService } from '@shared/services/queue.service';
import { UserJobRepository } from '@impler/dal';
import { QueuesEnum } from '@impler/shared';

@Injectable()
export class CronJobService {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly userJobRepository: UserJobRepository,
    private queueService: QueueService
  ) {}

  async pauseJob(jobId: string) {
    const job = this.schedulerRegistry.getCronJob(`${jobId}_rss_import`);
    job.stop();

    return { message: `Job ${jobId} paused successfully` };
  }

  async startJob(userId: string, jobId: string) {
    const userJob = await this.userJobRepository.findOne({ _id: jobId, userId });
    if (!userJob) {
      throw new Error(`Job ${jobId} not found for user ${userId}`);
    }

    const cronExpression = userJob.cron;
    const job = new CronJob(cronExpression, () => this.triggerImportJob(jobId));
    this.schedulerRegistry.addCronJob(`${jobId}_rss_import`, job);
    job.start();

    return { message: `Job ${jobId} started successfully with schedule: ${cronExpression}` };
  }

  async deleteJob(userId: string, jobId: string) {
    await this.userJobRepository.delete({ _id: jobId, userId });
    this.schedulerRegistry.deleteCronJob(`${jobId}_rss_import`);

    return { message: `Job ${jobId} deleted successfully` };
  }

  async triggerImportJob(_jobId: string) {
    try {
      this.queueService.publishToQueue(QueuesEnum.SEND_RSS_XML_DATA, { _jobId });
      console.log(`Import job triggered for job ${_jobId}`);
    } catch (error) {
      console.error(`Error triggering import job for ${_jobId}:`, error);
    }
  }
}
