import { CreateUserJob, UpdateUserJob, UserJobTriggerService } from 'app/import-jobs/usecase';
import { AutoImportJobsSchedular } from './auto-import-jobs-schedular';
import { QueueService } from '@shared/services/queue.service';

export const USE_CASES = [
  AutoImportJobsSchedular,
  UpdateUserJob,
  UserJobTriggerService,
  UserJobTriggerService,
  QueueService,
  CreateUserJob,
  //
];
export { AutoImportJobsSchedular, UpdateUserJob, UserJobTriggerService, QueueService, CreateUserJob };
