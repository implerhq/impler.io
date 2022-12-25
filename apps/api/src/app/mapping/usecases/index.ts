import { DoMapping } from './do-mapping/do-mapping.usecase';
import { GetMappings } from './get-mappings/get-mappings.usecase';
import { UpdateMappings } from './update-mappings/update-mappings.usecase';
import { FinalizeUpload } from './finalize-upload/finalize-upload.usecase';
import { ValidateMapping } from './validate-mapping/validate-mapping.usecase';
import { GetUpload } from '@shared/usecases/get-upload/get-upload.usecase';

export const USE_CASES = [
  DoMapping,
  GetMappings,
  UpdateMappings,
  FinalizeUpload,
  ValidateMapping,
  GetUpload,
  //
];
