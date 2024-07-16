import { CreateUserJob } from './create-userjob/create-userjob.usecase';
import { GetImportJobInfo } from './get-importjobinfo/get-importjobinfo.usecase';
import { GetImportMappingInfo } from './get-mapping/get-mapping.usecase';

export const USECASES = [
  CreateUserJob,
  GetImportJobInfo,
  GetImportMappingInfo,
  //
];

export { CreateUserJob, GetImportJobInfo, GetImportMappingInfo };
