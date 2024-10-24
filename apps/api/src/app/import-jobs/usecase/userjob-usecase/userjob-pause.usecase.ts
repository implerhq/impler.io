import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { NameService } from '@impler/services';
import { UserJobImportStatusEnum } from '@impler/shared';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class UserJobPause {
  constructor(
    private readonly nameService: NameService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly userJobRepository: UserJobRepository
  ) {}

  async execute(_jobId: string): Promise<UserJobEntity> {
    const userJob = await this.userJobRepository.findById(_jobId);
    if (!userJob) {
      throw new DocumentNotFoundException('Userjob', _jobId);
    }

    const userCronJob = this.schedulerRegistry.getCronJob(this.nameService.getCronName(_jobId));

    userCronJob.stop();

    const updatedUserJob = await this.userJobRepository.findOneAndUpdate(
      { _id: _jobId },
      { $set: { status: UserJobImportStatusEnum.PAUSED } },
      { returnDocument: 'after' }
    );

    return updatedUserJob;
  }
}
