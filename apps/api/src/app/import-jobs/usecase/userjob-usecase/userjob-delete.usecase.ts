import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { BadRequestException } from '@nestjs/common';
import { NameService } from '@impler/services';
import { UserJobEntity, UserJobRepository } from '@impler/dal';

@Injectable()
export class UserJobDelete {
  constructor(
    private readonly nameService: NameService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly userJobRepository: UserJobRepository
  ) {}

  async execute({ externalUserId, _jobId }: { externalUserId: string; _jobId: string }): Promise<UserJobEntity> {
    const deletedUserJob = await this.userJobRepository.delete({ _id: _jobId, externalUserId });

    if (!deletedUserJob) {
      throw new BadRequestException(`Unable to Delete UserJob with id ${_jobId}`);
    }

    this.schedulerRegistry.deleteCronJob(this.nameService.getCronName(_jobId));

    return deletedUserJob;
  }
}
