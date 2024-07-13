import { BaseRepository } from '../base-repository';
import { UserJob } from './userjob.schema';
import { UserJobEntity } from './userjob.entity';

export class UserJobRepository extends BaseRepository<UserJobEntity> {
  constructor() {
    super(UserJob, UserJobEntity);
  }
}
