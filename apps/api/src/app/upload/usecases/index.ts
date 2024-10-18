import { GetAsset } from './get-asset/get-asset.usecase';
import { GetUploadColumns } from './get-columns/get-columns.usecase';
import { SetHeaderRow } from './set-header-row/set-header-row.usecase';
import { GetUpload } from '@shared/usecases/get-upload/get-upload.usecase';
import { GetPreviewRows } from './get-preview-rows/get-preview-rows.usecase';
import { TerminateUpload } from './terminate-upload/terminate-upload.usecase';
import { MakeUploadEntry } from './make-upload-entry/make-upload-entry.usecase';
import { PaginateFileContent } from './paginate-file-content/paginate-file-content.usecase';
import { GetOriginalFileContent } from './get-original-file-content/get-original-file-content.usecase';
import { GetUploadProcessInformation } from './get-upload-process-info/get-upload-process-info.usecase';

export const USE_CASES = [
  GetPreviewRows,
  GetAsset,
  GetUpload,
  SetHeaderRow,
  TerminateUpload,
  MakeUploadEntry,
  GetUploadColumns,
  PaginateFileContent,
  GetOriginalFileContent,
  GetUploadProcessInformation,
  //
];

export {
  GetPreviewRows,
  GetAsset,
  GetUpload,
  SetHeaderRow,
  MakeUploadEntry,
  TerminateUpload,
  GetUploadColumns,
  GetOriginalFileContent,
  GetUploadProcessInformation,
  PaginateFileContent,
};
