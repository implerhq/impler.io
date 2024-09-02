import { PaymentAPIService } from '@impler/services';
import { DoReview } from './do-review/do-review.usecase';
import { UpdateRecord } from './update-cell/update-cell.usecase';
import { DeleteRecord } from './delete-record/delete-record.usecase';
import { DoReReview } from './do-review/re-review-data.usecase';
import { StartProcess } from './start-process/start-process.usecase';
import { GetUploadData } from './get-upload-data/get-upload-data.usecase';
import { GetUpload } from '@shared/usecases/get-upload/get-upload.usecase';

export const USE_CASES = [
  DoReview,
  GetUpload,
  DoReReview,
  DeleteRecord,
  UpdateRecord,
  StartProcess,
  GetUploadData,
  PaymentAPIService,
];

export { DoReview, GetUpload, DoReReview, DeleteRecord, UpdateRecord, StartProcess, GetUploadData, PaymentAPIService };
