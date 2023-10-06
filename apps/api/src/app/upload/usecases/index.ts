import { MakeUploadEntry } from './make-upload-entry/make-upload-entry.usecase';
import { GetUpload } from '@shared/usecases/get-upload/get-upload.usecase';
import { GetOriginalFileContent } from './get-original-file-content/get-original-file-content.usecase';
import { GetUploadProcessInformation } from './get-upload-process-info/get-upload-process-info.usecase';
import { PaginateFileContent } from './paginate-file-content/paginate-file-content.usecase';

export const USE_CASES = [
  MakeUploadEntry,
  GetUpload,
  GetOriginalFileContent,
  PaginateFileContent,
  GetUploadProcessInformation,
  //
];

export { MakeUploadEntry, GetUpload, GetOriginalFileContent, GetUploadProcessInformation, PaginateFileContent };
