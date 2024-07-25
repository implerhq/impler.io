import { BadRequestException, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import { QueueService } from '@shared/services/queue.service';
import { UserJobRepository } from '@impler/dal';
import { QueuesEnum, UserJobImportStatusEnum } from '@impler/shared';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class CronJobService {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly userJobRepository: UserJobRepository,
    private queueService: QueueService
  ) {}

  async pauseJob(_jobId: string) {
    const userJob = this.schedulerRegistry.getCronJob(`${_jobId}_rss_import`);

    if (!userJob) {
      throw new DocumentNotFoundException(`Userjob`, _jobId);
    }
    userJob.stop();

    const updatedUserJob = await this.userJobRepository.findOneAndUpdate(
      { _id: _jobId },
      { $set: { status: UserJobImportStatusEnum.PAUSED } },
      { returnDocument: 'after' }
    );

    return {
      updatedUserJob,
    };
  }

  async startJob(_jobId: string) {
    const userJob = await this.userJobRepository.findOne({ _id: _jobId });
    if (!userJob) {
      throw new DocumentNotFoundException(`Userjob`, _jobId);
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
    const userJob = await this.userJobRepository.findOne({ _id: _jobId });
    if (!userJob) {
      throw new DocumentNotFoundException(`Userjob`, _jobId);
    }

    return await this.userJobRepository.findOneAndUpdate(
      { _id: _jobId },
      { $set: { status: UserJobImportStatusEnum.TERMINATED } }
    );
  }

  async resumeJob(_jobId: string) {
    const userJob = await this.userJobRepository.findOne({ _id: _jobId });

    if (!userJob) {
      throw new DocumentNotFoundException(`Userjob`, _jobId);
    }

    if (userJob.status !== UserJobImportStatusEnum.PAUSED) {
      throw new BadRequestException(`Job ${_jobId} is not paused. Current status: ${userJob.status}`);
    }

    const cronExpression = userJob.cron;
    const existingJob = this.schedulerRegistry.getCronJob(`${_jobId}_rss_import`);

    if (existingJob) {
      existingJob.setTime(new CronTime(cronExpression));
      existingJob.start();
    } else {
      const newJob = new CronJob(cronExpression, () => this.triggerImportJob(_jobId));
      this.schedulerRegistry.addCronJob(`${_jobId}_rss_import`, newJob);
      newJob.start();
    }

    const updatedUserJob = await this.userJobRepository.findOneAndUpdate(
      { _id: _jobId },
      { $set: { status: UserJobImportStatusEnum.RUNNING } },
      { returnDocument: 'after' }
    );

    if (!updatedUserJob) {
      throw new DocumentNotFoundException(`No User Job was found with the given _jobId ${_jobId}`, _jobId);
    }

    return {
      updatedUserJob,
    };
  }

  async triggerImportJob(_jobId: string) {
    try {
      this.queueService.publishToQueue(QueuesEnum.GET_IMPORT_JOB_DATA, { _jobId });
    } catch (error) {
      throw error;
    }
  }
}
