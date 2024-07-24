import { CronJob } from 'cron';
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

import { UserJobImportStatusEnum } from '@impler/shared';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { UpdateUserJobCommand } from './update-userjob.command';
import { CronJobService } from '@shared/services/cronjob.service';

@Injectable()
export class UpdateUserJob {
  constructor(
    private readonly cronJobService: CronJobService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly userJobRepository: UserJobRepository
  ) {}

  async execute(jobId: string, data: UpdateUserJobCommand): Promise<UserJobEntity> {
    data.status = UserJobImportStatusEnum.SCHEDULING;
    const userJob = await this.userJobRepository.findOneAndUpdate({ _id: jobId }, data);

    this.scheduleRssImportJob(jobId, data.cron);

    return userJob;
  }

  private scheduleRssImportJob(jobId: string, cronExpression: string) {
    const job = new CronJob(cronExpression, () => this.cronJobService.triggerImportJob(jobId));
    this.schedulerRegistry.addCronJob(`${jobId}_rss_import`, job);

    job.start();

    Logger.log(`Cron job for RSS import started with schedule: ${cronExpression}`);
  }
}
