import { Injectable } from '@nestjs/common';
import { QueueService } from '@shared/services/queue.service';
import { QueuesEnum } from '@impler/shared';

@Injectable()
export class UserJobTriggerService {
  constructor(private readonly queueService: QueueService) {}

  execute(_jobId: string) {
    this.queueService.publishToQueue(QueuesEnum.GET_IMPORT_JOB_DATA, { _jobId });
  }
}
