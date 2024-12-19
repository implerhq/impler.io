import { CronJob } from 'cron';
import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { NameService } from '@impler/services';
import { UserJobTriggerService } from '../userjob-usecase/userjob-trigger.usecase';

@Injectable()
export class ScheduleUserJob {
  constructor(
    private readonly nameService: NameService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly userJobTriggerService: UserJobTriggerService
  ) {}

  async execute(jobId: string, cronExpression: string) {
    const cronJobName = this.nameService.getCronName(jobId);

    if (this.schedulerRegistry.doesExist('cron', cronJobName)) {
      return;
    }

    const job = new CronJob(cronExpression, () => this.userJobTriggerService.execute(jobId));
    this.schedulerRegistry.addCronJob(cronJobName, job as any);

    job.start();
  }
}
