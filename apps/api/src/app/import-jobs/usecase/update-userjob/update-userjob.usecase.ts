import { CronJob } from 'cron';
import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

import { NameService } from '@impler/services';
import { UserJobImportStatusEnum } from '@impler/shared';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { UpdateUserJobCommand } from './update-userjob.command';
import { UserJobTriggerService } from '../userjob-usecase/userjob-trigger.usecase';

@Injectable()
export class UpdateUserJob {
  constructor(
    private readonly nameService: NameService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly userJobRepository: UserJobRepository,
    private readonly userJobTriggerService: UserJobTriggerService
  ) {}

  async execute(jobId: string, data: UpdateUserJobCommand): Promise<UserJobEntity> {
    data.status = UserJobImportStatusEnum.SCHEDULING;
    const userJob = await this.userJobRepository.findOneAndUpdate({ _id: jobId }, data);

    this.scheduleRssImportJob(jobId, data.cron);

    return userJob;
  }

  private scheduleRssImportJob(jobId: string, cronExpression: string) {
    const job = new CronJob(cronExpression, () => this.userJobTriggerService.execute(jobId));
    this.schedulerRegistry.addCronJob(this.nameService.getCronName(jobId), job as any);

    job.start();
  }
}
