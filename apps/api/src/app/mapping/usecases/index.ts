import { DoMapping } from './do-mapping/do-mapping.usecase';
import { GetMappings } from './get-mappings/get-mappings.usecase';
import { UpdateMappings } from './update-mappings/update-mappings.usecase';
import { FinalizeUpload } from './finalize-upload/finalize-upload.usecase';
import { GetUpload } from '@shared/usecases/get-upload/get-upload.usecase';
import { ValidateMapping } from './validate-mapping/validate-mapping.usecase';
import { ReanameFileHeadings } from './rename-file-headings/rename-file-headings.usecase';

import { DoMappingCommand } from './do-mapping/do-mapping.command';
import { ValidateMappingCommand } from './validate-mapping/validate-mapping.command';

export const USE_CASES = [
  DoMapping,
  GetMappings,
  UpdateMappings,
  FinalizeUpload,
  ValidateMapping,
  ReanameFileHeadings,
  GetUpload,
  //
];

export { DoMapping, ValidateMapping, GetMappings, UpdateMappings, FinalizeUpload, ReanameFileHeadings, GetUpload };

export { DoMappingCommand, ValidateMappingCommand };
