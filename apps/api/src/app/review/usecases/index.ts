import { DoReview } from './do-review/do-review.usecase';
import { StartProcess } from './start-process/start-process.usecase';
import { ConfirmReview } from './confirm-review/confirm-review.usecase';
import { GetUpload } from '@shared/usecases/get-upload/get-upload.usecase';
import { SaveReviewData } from './save-review-data/save-review-data.usecase';
import { UpdateImportCount } from './update-import-count/update-import-count.usecase';
import { ReanameFileHeadings } from './rename-file-headings/rename-file-headings.usecase';
import { GetFileInvalidData } from './get-file-invalid-data/get-file-invalid-data.usecase';
import { GetUploadInvalidData } from './get-upload-invalid-data/get-upload-invalid-data.usecase';

import { StartProcessCommand } from './start-process/start-process.command';
import { UpdateImportCountCommand } from './update-import-count/update-import-count.command';

export const USE_CASES = [
  DoReview,
  GetUpload,
  StartProcess,
  ConfirmReview,
  SaveReviewData,
  GetFileInvalidData,
  GetUploadInvalidData,
  ReanameFileHeadings,
  UpdateImportCount,
  //
];

export {
  DoReview,
  SaveReviewData,
  GetUpload,
  StartProcess,
  ConfirmReview,
  GetFileInvalidData,
  GetUploadInvalidData,
  ReanameFileHeadings,
  UpdateImportCount,
};
export { UpdateImportCountCommand, StartProcessCommand };
