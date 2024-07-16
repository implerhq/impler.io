import { UserJob } from './userjob.schema';
import { UserJobEntity } from './userjob.entity';
import { BaseRepository } from '../base-repository';

export class UserJobRepository extends BaseRepository<UserJobEntity> {
  constructor() {
    super(UserJob, UserJobEntity);
  }
}
