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

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCronSchedular() {
    const startTime = new Date();
    const memUsageStart = process.memoryUsage();
    const cpuUsageStart = process.cpuUsage();
    
    console.log('========================================');
    console.log(`[AUTO-IMPORT-JOBS-SCHEDULER] Cron Started at ${startTime.toISOString()}`);
    console.log(`[AUTO-IMPORT-JOBS-SCHEDULER] Memory Usage (Start): RSS=${(memUsageStart.rss / 1024 / 1024).toFixed(2)}MB, Heap=${(memUsageStart.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    console.log('========================================');
    
    try {
      await this.fetchAndExecuteScheduledJobs();
      
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      const memUsageEnd = process.memoryUsage();
      const cpuUsageEnd = process.cpuUsage(cpuUsageStart);
      
      console.log('========================================');
      console.log(`[AUTO-IMPORT-JOBS-SCHEDULER] Cron Completed at ${endTime.toISOString()}`);
      console.log(`[AUTO-IMPORT-JOBS-SCHEDULER] Duration: ${duration}ms`);
      console.log(`[AUTO-IMPORT-JOBS-SCHEDULER] Memory Usage (End): RSS=${(memUsageEnd.rss / 1024 / 1024).toFixed(2)}MB, Heap=${(memUsageEnd.heapUsed / 1024 / 1024).toFixed(2)}MB`);
      console.log(`[AUTO-IMPORT-JOBS-SCHEDULER] Memory Delta: RSS=${((memUsageEnd.rss - memUsageStart.rss) / 1024 / 1024).toFixed(2)}MB, Heap=${((memUsageEnd.heapUsed - memUsageStart.heapUsed) / 1024 / 1024).toFixed(2)}MB`);
      console.log(`[AUTO-IMPORT-JOBS-SCHEDULER] CPU Usage: User=${(cpuUsageEnd.user / 1000).toFixed(2)}ms, System=${(cpuUsageEnd.system / 1000).toFixed(2)}ms`);
      
      if (duration > 5000) {
        console.warn(`[AUTO-IMPORT-JOBS-SCHEDULER] ⚠️ WARNING: Cron execution took ${duration}ms (>5s threshold)`);
      }
      console.log('========================================');
    } catch (error) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      console.error('========================================');
      console.error(`[AUTO-IMPORT-JOBS-SCHEDULER] ❌ ERROR at ${endTime.toISOString()}`);
      console.error(`[AUTO-IMPORT-JOBS-SCHEDULER] Duration before error: ${duration}ms`);
      console.error('[AUTO-IMPORT-JOBS-SCHEDULER] Error details:', error);
      console.error('========================================');
    }
  }

  private async fetchAndExecuteScheduledJobs() {
    const now = dayjs();
    const userJobs = await this.userJobRepository.find({});
    
    console.log(`[AUTO-IMPORT-JOBS-SCHEDULER] Total jobs found: ${userJobs.length}`);
    
    let jobsProcessed = 0;
    let jobsSkipped = 0;
    let jobsExecuted = 0;

    for (const userJob of userJobs) {
      const jobStartTime = Date.now();
      try {
        if (await this.shouldCroneRun({ userJob })) {
          if (this.isJobDueNow(userJob.nextRun, now)) {
            console.log(`[AUTO-IMPORT-JOBS-SCHEDULER] Job is due now - JobID: ${userJob._id}, Time: ${new Date().toISOString()}`);
            
            const nextScheduledTime = this.calculateNextRun(userJob.cron, userJob.nextRun);
            await this.scheduleUpdateNextRun(userJob._id, nextScheduledTime, dayjs(userJob.endsOn));
            
            const executeStartTime = Date.now();
            await this.userJobTriggerService.execute(userJob._id);
            const executeDuration = Date.now() - executeStartTime;
            
            jobsExecuted++;
            console.log(`[AUTO-IMPORT-JOBS-SCHEDULER] Job executed - JobID: ${userJob._id}, Duration: ${executeDuration}ms`);
            
            if (executeDuration > 5000) {
              console.warn(`[AUTO-IMPORT-JOBS-SCHEDULER] ⚠️ WARNING: Job execution took ${executeDuration}ms (>5s) - JobID: ${userJob._id}`);
            }
          } else {
            jobsSkipped++;
          }
        } else {
          jobsSkipped++;
        }
        
        jobsProcessed++;
        const jobDuration = Date.now() - jobStartTime;
        if (jobDuration > 1000) {
          console.log(`[AUTO-IMPORT-JOBS-SCHEDULER] Job processing took ${jobDuration}ms - JobID: ${userJob._id}`);
        }
      } catch (error) {
        console.error(`[AUTO-IMPORT-JOBS-SCHEDULER] ❌ Error processing job ${userJob._id} at ${new Date().toISOString()}`, error);
      }
    }
    
    console.log(`[AUTO-IMPORT-JOBS-SCHEDULER] Summary - Processed: ${jobsProcessed}, Executed: ${jobsExecuted}, Skipped: ${jobsSkipped}`);
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
