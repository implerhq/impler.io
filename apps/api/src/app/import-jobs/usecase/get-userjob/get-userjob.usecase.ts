import { UserJobRepository } from '@impler/dal';

export class GetUserJob {
  constructor(private readonly userJobRepository: UserJobRepository) {}

  async execute(externalUserId: string) {
    return this.userJobRepository.find({ externalUserId });
  }
}
