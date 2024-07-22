import { BaseRepository } from '../base-repository';
import { ImportJobHistoryEntity } from './import-job-history.entity';
import { ImportJobHistory } from './import-job-history.schema';

export class ImportJobHistoryRepository extends BaseRepository<ImportJobHistoryEntity> {
  constructor() {
    super(ImportJobHistory, ImportJobHistoryEntity);
  }
}
