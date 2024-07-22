import { BaseRepository } from '../base-repository';
import { ImportJobHistoryEntity } from './import-job-history.entity';
import { ImportJobHistory } from './import-job-history.schema';

export class ImportJobHistoryRepository extends BaseRepository<ImportJobHistoryEntity> {
  constructor() {
    super(ImportJobHistory, ImportJobHistoryEntity);
  }
  async getHistoryWithJob(importJobHistoryId: string, fields: string[]): Promise<ImportJobHistoryEntity> {
    return await ImportJobHistory.findById(importJobHistoryId).populate('_jobId', fields.join(' '));
  }
}
