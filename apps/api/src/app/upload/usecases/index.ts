import { GetUploadColumns } from './get-columns/get-columns.usecase';
import { GetUpload } from '@shared/usecases/get-upload/get-upload.usecase';
import { MakeUploadEntry } from './make-upload-entry/make-upload-entry.usecase';
import { PaginateFileContent } from './paginate-file-content/paginate-file-content.usecase';
import { GetOriginalFileContent } from './get-original-file-content/get-original-file-content.usecase';
import { GetUploadProcessInformation } from './get-upload-process-info/get-upload-process-info.usecase';

export const USE_CASES = [
  GetUpload,
  MakeUploadEntry,
  GetUploadColumns,
  PaginateFileContent,
  GetOriginalFileContent,
  GetUploadProcessInformation,
  //
];

export {
  MakeUploadEntry,
  GetUpload,
  GetUploadColumns,
  GetOriginalFileContent,
  GetUploadProcessInformation,
  PaginateFileContent,
};
