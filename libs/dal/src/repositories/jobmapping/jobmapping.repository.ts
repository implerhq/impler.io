import { BaseRepository } from '../base-repository';
import { JobMapping } from './jobmapping.schema';
import { JobMappingEntity } from './jobmapping.entity';

export class JobMappingRepository extends BaseRepository<JobMappingEntity> {
  constructor() {
    super(JobMapping, JobMappingEntity);
  }
}
