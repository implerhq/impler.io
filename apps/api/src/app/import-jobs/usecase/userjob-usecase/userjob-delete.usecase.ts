import { Injectable } from '@nestjs/common';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class UserJobDelete {
  constructor(private readonly userJobRepository: UserJobRepository) {}

  async execute({ externalUserId, _jobId }: { externalUserId: string; _jobId: string }): Promise<UserJobEntity> {
    const userJobToDelete = await this.userJobRepository.findOne({ _id: _jobId, externalUserId });

    if (!userJobToDelete) {
      throw new DocumentNotFoundException(
        'Userjob',
        _jobId,
        `Userjob with JobId ${_jobId} and externalUserId ${externalUserId} not found`
      );
    }

    try {
      await this.userJobRepository.delete({ _id: _jobId });
    } catch (error) {}

    return userJobToDelete;
  }
}
