import { Injectable } from '@nestjs/common';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { UpdateUserJobCommand } from './update-userjob.command';

@Injectable()
export class UpdateUserJob {
  constructor(private readonly userJobRepository: UserJobRepository) {}

  async execute(_id: string, data: UpdateUserJobCommand): Promise<UserJobEntity> {
    return await this.userJobRepository.findOneAndUpdate({ _id }, data);
  }
}
