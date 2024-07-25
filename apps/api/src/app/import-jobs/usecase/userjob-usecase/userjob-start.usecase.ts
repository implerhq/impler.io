import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { UserJobImportStatusEnum } from '@impler/shared';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';
import { CronJob } from 'cron';
import { UserJobTriggerService } from './userjob-trigger.usecase';

@Injectable()
export class UserJobStart {
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

    const cronExpression = userJob.cron;

    const updatedUserJob = await this.userJobRepository.findOneAndUpdate(
      { _id: _jobId },
      { $set: { status: UserJobImportStatusEnum.RUNNING } }
    );

    if (!updatedUserJob) {
      throw new DocumentNotFoundException(`Userjob`, _jobId);
    }

    const job = new CronJob(cronExpression, () => this.userJobTriggerService.execute(_jobId));
    this.schedulerRegistry.addCronJob(`${_jobId}_rss_import`, job);
    job.start();

    return updatedUserJob;
  }
}
