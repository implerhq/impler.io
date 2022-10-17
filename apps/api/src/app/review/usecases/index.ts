import { DoReview } from './do-review/do-review.usecase';
import { SaveReviewData } from './save-review-data/save-review-data.usecase';
import { GetUploadInvalidData } from './get-upload-invalid-data/get-upload-invalid-data.usecase';
import { GetFileInvalidData } from './get-file-invalid-data/get-file-invalid-data.usecase';

export const USE_CASES = [
  DoReview,
  SaveReviewData,
  GetFileInvalidData,
  GetUploadInvalidData,
  //
];
