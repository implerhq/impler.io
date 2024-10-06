import { UserJobRepository } from '@impler/dal';
import { BadRequestException, Injectable } from '@nestjs/common';
import { APIMessages } from '@shared/constants';

@Injectable()
export class GetUserJob {
  constructor(private readonly userJobRepository: UserJobRepository) {}

  async execute(externalUserId: string) {
    const userJob = await this.userJobRepository.find({ externalUserId });

    if (!userJob) {
      throw new BadRequestException(APIMessages.USER_JOB_NOT_FOUND);
    }

    return userJob;
  }
}
