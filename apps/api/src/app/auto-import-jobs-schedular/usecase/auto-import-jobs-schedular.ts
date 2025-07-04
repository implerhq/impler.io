import { UserJobEntity, UserJobRepository, WebhookDestinationRepository } from '@impler/dal';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as parser from 'cron-parser';
import { Cron } from '@nestjs/schedule';
import { ScheduleUserJob, UpdateUserJob } from 'app/import-jobs/usecase';
import { UserJobImportStatusEnum } from '@impler/shared';
import { CRON_SCHEDULE } from '@shared/constants';
// import { CRON_SCHEDULE } from '@shared/constants';
const parseCronExpression = require('@impler/shared/src/utils/cronstrue');

@Injectable()
export class AutoImportJobsSchedular {
  constructor(
    private readonly userJobRepository: UserJobRepository,
    private readonly webhookDestinationRepository: WebhookDestinationRepository,
    private readonly updateUserJob: UpdateUserJob,
    private readonly scheduleUserJob: ScheduleUserJob
  ) {}

  @Cron(CRON_SCHEDULE.AUTO_IMPORT_DEFAULT_CRON_TIME)
  async handleCronSchedular() {
    await this.fetchAndExecuteScheduledJobs();
  }

  private async fetchAndExecuteScheduledJobs() {
    const now = dayjs();
    const userJobs = await this.userJobRepository.find({});

    for (const userJob of userJobs) {
      if (await this.shouldCroneRun({ userJob })) {
        try {
          const interval = parser.parseExpression(userJob.cron);

          const nextScheduledTime = dayjs(interval.next().toDate().toDateString());

          if (this.isJobDueToday(userJob.cron, now)) {
            await this.scheduleUpdateNextRun(userJob._id, nextScheduledTime, dayjs(userJob.endsOn));

            await this.updateUserJob.execute(userJob._id, userJob);

            await this.scheduleUserJob.execute(userJob._id, userJob.cron);
          }
        } catch (error) {}
      }
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

  private isJobDueToday(cronExpression: string, currentDate: dayjs.Dayjs): boolean {
    try {
      const interval = parser.parseExpression(cronExpression);

      const nextScheduledTime = dayjs(interval.next().toDate());

      return nextScheduledTime.isSame(currentDate, 'd');
    } catch (error) {
      return false;
    }
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

    if (
      (userJob.cron && userJob.status === UserJobImportStatusEnum.SCHEDULING) ||
      userJob.status === UserJobImportStatusEnum.RUNNING ||
      (userJob.status === 'Completed' && (await this.fetchDestination(userJob._templateId)) && !userJob.endsOn) ||
      !dayjs(userJob.endsOn).isSame(now, 'd')
    ) {
      return true;
    }

    return false;
  }
}
