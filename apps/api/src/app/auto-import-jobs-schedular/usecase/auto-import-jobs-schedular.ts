import { UserJobEntity, UserJobRepository, WebhookDestinationRepository } from '@impler/dal';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserJobImportStatusEnum } from '@impler/shared';
import * as dayjs from 'dayjs';
const parser = require('cron-parser');
import parseCronExpression from '@impler/shared/src/utils/cronstrue';
import { UserJobTriggerService } from 'app/import-jobs/usecase/userjob-usecase/userjob-trigger.usecase';

@Injectable()
export class AutoImportJobsSchedular {
  constructor(
    private readonly userJobRepository: UserJobRepository,
    private readonly webhookDestinationRepository: WebhookDestinationRepository,
    private readonly userJobTriggerService: UserJobTriggerService
  ) {}

  @Cron(CronExpression.EVERY_8_HOURS)
  async handleCronSchedular() {
    console.log('Cron Running');
    await this.fetchAndExecuteScheduledJobs();
  }

  private async fetchAndExecuteScheduledJobs() {
    const now = dayjs();
    const userJobs = await this.userJobRepository.find({});

    for (const userJob of userJobs) {
      if (await this.shouldCroneRun({ userJob })) {
        try {
          if (this.isJobDueNow(userJob.nextRun, now)) {
            const nextScheduledTime = this.calculateNextRun(userJob.cron, userJob.nextRun);

            await this.scheduleUpdateNextRun(userJob._id, nextScheduledTime, dayjs(userJob.endsOn));

            await this.userJobTriggerService.execute(userJob._id);
          }
        } catch (error) {}
      }
    }
  }

  calculateNextRun(cronExpression: string, currentNextRun: Date): dayjs.Dayjs {
    try {
      if (!cronExpression || typeof cronExpression !== 'string' || cronExpression.trim() === '') {
        return dayjs(currentNextRun).add(24, 'hours');
      }

      const interval = parser.parseExpression(cronExpression.trim(), {
        currentDate: currentNextRun,
        tz: 'Asia/Kolkata',
      });

      const nextRun = interval.next().toDate();

      return dayjs(nextRun);
    } catch (error) {
      return dayjs(currentNextRun).add(24, 'hours');
    }
  }

  async scheduleUpdateNextRun(userJobId: string, nextRunSchedule: dayjs.Dayjs, endsOn: dayjs.Dayjs) {
    const nextRunValue = dayjs(nextRunSchedule).isAfter(endsOn) && endsOn ? undefined : nextRunSchedule;

    await this.userJobRepository.update({ _id: userJobId }, { $set: { nextRun: nextRunValue } });
  }

  async parseCronExpression(userCronExpression: string) {
    if (!userCronExpression || userCronExpression.trim() === '') {
      throw new Error('Cron expression is empty');
    }

    return parseCronExpression.toString(userCronExpression);
  }

  private isJobDueNow(nextRunDate: Date, currentDate: dayjs.Dayjs): boolean {
    if (!nextRunDate) {
      return false;
    }

    const nextRun = dayjs(nextRunDate);

    return currentDate.isSame(nextRun, 'minute');
  }

  async fetchDestination(templateId: string) {
    const webhookDestination = await this.webhookDestinationRepository.findOne({
      _templateId: templateId,
    });

    if (!webhookDestination) {
      return false;
    }

    const { _id, callbackUrl } = webhookDestination;

    return { _id, callbackUrl };
  }

  async shouldCroneRun({ userJob }: { userJob: UserJobEntity }): Promise<boolean> {
    const now = dayjs();

    if (userJob.status === UserJobImportStatusEnum.PAUSED) {
      return false;
    }

    if (userJob.endsOn && dayjs(userJob.endsOn).isBefore(now)) {
      return false;
    }

    if (!userJob.nextRun) {
      return false;
    }

    if (
      userJob.cron &&
      (userJob.status === UserJobImportStatusEnum.SCHEDULING ||
        userJob.status === UserJobImportStatusEnum.RUNNING ||
        (userJob.status === UserJobImportStatusEnum.COMPLETED && (await this.fetchDestination(userJob._templateId))))
    ) {
      return true;
    }

    return false;
  }
}
