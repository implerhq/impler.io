import { MakeUploadEntry } from './make-upload-entry/make-upload-entry.usecase';
import { GetUpload } from './get-upload/get-upload.usecase';
import { GetUploads } from './get-uploads/get-uploads.usecase';
import { DoMapping } from './do-mapping/do-mapping.usecase';
import { GetMappings } from './get-mappings/get-mappings.usecase';

export const USE_CASES = [
  MakeUploadEntry,
  GetUpload,
  GetUploads,
  DoMapping,
  GetMappings,
  //
];
