import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { UserJobImportStatusEnum } from '@impler/shared';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class UserJobPause {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly userJobRepository: UserJobRepository
  ) {}

  async execute(_jobId: string): Promise<UserJobEntity> {
    const userJob = this.schedulerRegistry.getCronJob(`${_jobId}_rss_import`);

    if (!userJob) {
      throw new DocumentNotFoundException(`Userjob`, _jobId);
    }
    userJob.stop();

    const updatedUserJob = await this.userJobRepository.findOneAndUpdate(
      { _id: _jobId },
      { $set: { status: UserJobImportStatusEnum.PAUSED } },
      { returnDocument: 'after' }
    );

    return updatedUserJob;
  }
}
