import { DoReview } from './do-review/do-review.usecase';
import { SaveReviewData } from './save-review-data/save-review-data.usecase';
import { GetUploadInvalidData } from './get-upload-invalid-data/get-upload-invalid-data.usecase';
import { GetFileInvalidData } from './get-file-invalid-data/get-file-invalid-data.usecase';
import { GetUpload } from '../../shared/usecases/get-upload/get-upload.usecase';
import { ConfirmReview } from './confirm-review/confirm-review.usecase';

export const USE_CASES = [
  DoReview,
  GetUpload,
  ConfirmReview,
  SaveReviewData,
  GetFileInvalidData,
  GetUploadInvalidData,
  //
];
