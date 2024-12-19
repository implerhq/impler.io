import { Injectable } from '@nestjs/common';
import { QueueService } from '@shared/services/queue.service';
import { QueuesEnum, UserJobImportStatusEnum } from '@impler/shared';
import { UserJobRepository } from '@impler/dal';
@Injectable()
export class UserJobTriggerService {
  constructor(
    private readonly queueService: QueueService,
    private readonly userJobRepository: UserJobRepository
  ) {}

  async execute(_jobId: string) {
    if (_jobId) {
      const updatedJob = await this.userJobRepository.findOneAndUpdate(
        { _id: _jobId },
        {
          $set: { status: UserJobImportStatusEnum.RUNNING },
        },
        { new: true }
      );

      if (updatedJob) {
        this.queueService.publishToQueue(QueuesEnum.GET_IMPORT_JOB_DATA, { _jobId });
      }
    }
  }
}
