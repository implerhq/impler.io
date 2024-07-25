import { Injectable } from '@nestjs/common';
import { QueueService } from '@shared/services/queue.service';
import { QueuesEnum } from '@impler/shared';

@Injectable()
export class UserJobTriggerService {
  constructor(private readonly queueService: QueueService) {}

  async execute(_jobId: string): Promise<void> {
    try {
      this.queueService.publishToQueue(QueuesEnum.GET_IMPORT_JOB_DATA, { _jobId });
    } catch (error) {
      throw error;
    }
    console.log('\x1b[32m%s\x1b[0m', `UserJob Triggered for _jobId: ${_jobId}`);
  }
}
