import { CreateUserJob } from './create-userjob/create-userjob.usecase';
import { GetColumnSchemaMapping } from './get-columnschema-mapping/get-columnschema-mapping.usecase';
import { CreateJobMapping } from './create-jobmapping/create-jobmapping.usecase';
import { UpdateUserJob } from './update-userjob/update-userjob.usecase';
import { GetUserJob } from './get-userjob/get-userjob.usecase';
import { RSSService } from '@shared/services';
import { QueueService } from '@shared/services/queue.service';
import { UserJobPause } from './userjob-usecase/userjob-pause.usecase';
import { UserJobDelete } from './userjob-usecase/userjob-delete.usecase';
import { UserJobTerminate } from './userjob-usecase/userjob-terminate.usecase';
import { UserJobTriggerService } from './userjob-usecase/userjob-trigger.usecase';
import { UserJobResume } from './userjob-usecase/userjob.resume.usecsae';

export const USECASES = [
  CreateUserJob,
  GetColumnSchemaMapping,
  CreateJobMapping,
  UpdateUserJob,
  GetUserJob,
  RSSService,
  QueueService,
  UserJobResume,
  UserJobPause,
  UserJobDelete,
  UserJobTerminate,
  UserJobTriggerService,
  //
];

export {
  CreateUserJob,
  GetColumnSchemaMapping,
  CreateJobMapping,
  UpdateUserJob,
  GetUserJob,
  UserJobResume,
  UserJobPause,
  UserJobDelete,
  UserJobTerminate,
  UserJobTriggerService,
};
