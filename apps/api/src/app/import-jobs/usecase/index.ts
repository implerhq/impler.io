import { CreateUserJob } from './create-userjob/create-userjob.usecase';
import { GetColumnSchemaMapping } from './get-columnschema-mapping/get-columnschema-mapping.usecase';
import { CreateJobMapping } from './create-jobmapping/create-jobmapping.usecase';
import { UpdateUserJob } from './update-userjob/update-userjob.usecase';
import { GetUserJob } from './get-userjob/get-userjob.usecase';

export const USECASES = [
  CreateUserJob,
  GetColumnSchemaMapping,
  CreateJobMapping,
  UpdateUserJob,
  GetUserJob,
  //
];

export { CreateUserJob, GetColumnSchemaMapping, CreateJobMapping, UpdateUserJob, GetUserJob };
