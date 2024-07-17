import { CreateUserJob } from './create-userjob/create-userjob.usecase';
import { GetJobMapping } from './get-jobmapping/get-jobmapping.usecase';
import { CreateJobMapping } from './create-jobmapping/create-jobmapping.usecase';
import { UpdateUserJob } from './update-userjob/update-userjob.usecase';

export const USECASES = [
  CreateUserJob,
  GetJobMapping,
  CreateJobMapping,
  UpdateUserJob,
  //
];

export { CreateUserJob, GetJobMapping, CreateJobMapping, UpdateUserJob };
