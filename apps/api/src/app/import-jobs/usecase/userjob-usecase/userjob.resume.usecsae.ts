import { Injectable, BadRequestException } from '@nestjs/common';

import { UserJobImportStatusEnum } from '@impler/shared';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class UserJobResume {
  constructor(private readonly userJobRepository: UserJobRepository) {}

  async execute(_jobId: string): Promise<UserJobEntity> {
    const userJob = await this.userJobRepository.findById(_jobId);

    if (!userJob) {
      throw new DocumentNotFoundException(`Userjob`, _jobId);
    }

    if (userJob.status !== UserJobImportStatusEnum.PAUSED) {
      throw new BadRequestException(`Userjob with id ${_jobId} is not paused. Current status: ${userJob.status}`);
    }

    const updatedUserJob = await this.userJobRepository.findOneAndUpdate(
      { _id: _jobId },
      { $set: { status: UserJobImportStatusEnum.RUNNING } },
      { returnDocument: 'after' }
    );

    return updatedUserJob;
  }
}
