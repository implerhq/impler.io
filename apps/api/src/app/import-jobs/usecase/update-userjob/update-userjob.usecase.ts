import { Injectable } from '@nestjs/common';
import { UserJobImportStatusEnum } from '@impler/shared';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { UpdateUserJobCommand } from './update-userjob.command';

@Injectable()
export class UpdateUserJob {
  constructor(private readonly userJobRepository: UserJobRepository) {}

  async execute(jobId: string, data: UpdateUserJobCommand): Promise<UserJobEntity> {
    data.status = UserJobImportStatusEnum.SCHEDULING;
    const userJob = await this.userJobRepository.findOneAndUpdate({ _id: jobId }, data);

    // this.scheduleRssImportJob(jobId, data.cron);

    return userJob;
  }
}
