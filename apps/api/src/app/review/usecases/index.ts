import { PaymentAPIService } from '@impler/services';
import { Replace } from './replace/replace.usecase';
import { DoReview } from './do-review/do-review.usecase';
import { DoReReview } from './do-review/re-review-data.usecase';
import { UpdateRecord } from './update-record/update-record.usecase';
import { UpdateRecords } from './update-records/update-records.usecase';
import { DeleteRecord } from './delete-record/delete-record.usecase';
import { StartProcess } from './start-process/start-process.usecase';
import { GetUploadData } from './get-upload-data/get-upload-data.usecase';
import { GetUpload } from '@shared/usecases/get-upload/get-upload.usecase';

export const USE_CASES = [
  Replace,
  DoReview,
  GetUpload,
  DoReReview,
  DeleteRecord,
  UpdateRecord,
  StartProcess,
  UpdateRecords,
  GetUploadData,
  PaymentAPIService,
];

export {
  Replace,
  DoReview,
  GetUpload,
  DoReReview,
  DeleteRecord,
  UpdateRecord,
  StartProcess,
  GetUploadData,
  UpdateRecords,
  PaymentAPIService,
};
