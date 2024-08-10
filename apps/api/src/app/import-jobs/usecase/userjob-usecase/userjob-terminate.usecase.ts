import { Injectable } from '@nestjs/common';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { UserJobImportStatusEnum } from '@impler/shared';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class UserJobTerminate {
  constructor(private readonly userJobRepository: UserJobRepository) {}

  async execute(_jobId: string): Promise<UserJobEntity> {
    const userJob = await this.userJobRepository.findOne({ _id: _jobId });
    if (!userJob) {
      throw new DocumentNotFoundException(`Userjob`, _jobId);
    }

    return await this.userJobRepository.findOneAndUpdate(
      { _id: _jobId },
      { $set: { status: UserJobImportStatusEnum.TERMINATED } }
    );
  }
}
