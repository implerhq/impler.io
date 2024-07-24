import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { QueueService } from '@shared/services/queue.service';
import { UserJobRepository } from '@impler/dal';
import { QueuesEnum, UserJobImportStatusEnum } from '@impler/shared';

@Injectable()
export class CronJobService {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly userJobRepository: UserJobRepository,
    private queueService: QueueService
  ) {}

  async pauseJob(_jobId: string) {
    const userJob = this.schedulerRegistry.getCronJob(`${_jobId}_rss_import`);
    if (userJob) {
      userJob.stop();
    } else {
      throw new Error(`Job ${_jobId}_rss_import not found`);
    }

    await this.userJobRepository.update({ _id: _jobId }, { $set: { status: UserJobImportStatusEnum.PAUSED } });

    return { message: `Job ${_jobId} paused successfully` };
  }

  async startJob(externalUserId: string, _jobId: string) {
    const userJob = await this.userJobRepository.findOne({ _id: _jobId, externalUserId });
    if (!userJob) {
      throw new Error(`Job ${_jobId} not found for user ${externalUserId}`);
    }

    const cronExpression = userJob.cron;
    await this.userJobRepository.update({ _id: _jobId }, { $set: { status: UserJobImportStatusEnum.RUNNING } });
    const job = new CronJob(cronExpression, () => this.triggerImportJob(_jobId));
    this.schedulerRegistry.addCronJob(`${_jobId}_rss_import`, job);
    job.start();

    return { message: `Job ${_jobId} started successfully with schedule: ${cronExpression}` };
  }

  async deleteJob(externalUserId: string, _jobId: string) {
    await this.userJobRepository.delete({ _id: _jobId, externalUserId });

    this.schedulerRegistry.deleteCronJob(`${_jobId}_rss_import`);

    return { message: `Job ${_jobId} deleted successfully` };
  }

  async deleteUserJob(_jobId: string) {
    return await this.userJobRepository.update(
      { _id: _jobId },
      { $set: { status: UserJobImportStatusEnum.TERMINATED } }
    );
  }

  async triggerImportJob(_jobId: string) {
    try {
      this.queueService.publishToQueue(QueuesEnum.GET_IMPORT_JOB_DATA, { _jobId });
    } catch (error) {
      throw error;
    }
  }
}
