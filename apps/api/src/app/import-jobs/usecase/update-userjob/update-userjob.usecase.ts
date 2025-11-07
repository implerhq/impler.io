import { Injectable } from '@nestjs/common';
import { UserJobImportStatusEnum } from '@impler/shared';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { UpdateUserJobCommand } from './update-userjob.command';
import { CreateUserJob } from 'app/import-jobs/usecase/create-userjob/create-userjob.usecase';

@Injectable()
export class UpdateUserJob {
  constructor(
    private readonly userJobRepository: UserJobRepository,
    private readonly createUserJob: CreateUserJob
  ) {}

  async execute(jobId: string, data: UpdateUserJobCommand): Promise<UserJobEntity> {
    data.status = UserJobImportStatusEnum.SCHEDULING;

    if (data.cron) {
      data.nextRun = this.createUserJob.calculateInitialNextRun(data.cron);
    }

    const userJob = await this.userJobRepository.findOneAndUpdate({ _id: jobId }, data);

    return userJob;
  }
}
