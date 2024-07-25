import { Injectable, BadRequestException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { UserJobImportStatusEnum } from '@impler/shared';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';
import { CronJob, CronTime } from 'cron';
import { UserJobTriggerService } from './userjob-trigger.usecase';

@Injectable()
export class UserJobResume {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly userJobRepository: UserJobRepository,
    private readonly userJobTriggerService: UserJobTriggerService
  ) {}

  async execute(_jobId: string): Promise<UserJobEntity> {
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
      const newJob = new CronJob(cronExpression, () => this.userJobTriggerService.execute(_jobId));
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

    return updatedUserJob;
  }
}
