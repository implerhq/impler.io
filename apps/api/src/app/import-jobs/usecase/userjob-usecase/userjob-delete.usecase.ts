import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UserJobDelete {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly userJobRepository: UserJobRepository
  ) {}

  async execute({ externalUserId, _jobId }: { externalUserId: string; _jobId: string }): Promise<UserJobEntity> {
    const deletedUserJob = await this.userJobRepository.delete({ _id: _jobId, externalUserId });

    if (!deletedUserJob) {
      throw new BadRequestException(`Unable to Delete UserJob with id ${_jobId}`);
    }

    this.schedulerRegistry.deleteCronJob(`${_jobId}_rss_import`);

    return deletedUserJob;
  }
}
