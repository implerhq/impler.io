import { model, models, Schema } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { ImportJobHistoryEntity } from './import-job-history.entity';

const importJobHistorySchema = new Schema(
  {
    _fileId: {
      type: Schema.Types.ObjectId,
      ref: 'File',
    },
    validFileId: {
      type: Schema.Types.String,
    },
    invalidFileId: {
      type: Schema.Types.String,
    },
    allDataFileId: {
      type: Schema.Types.String,
    },
    fetchStatus: {
      type: Schema.Types.String,
    },
    status: {
      type: Schema.Types.String,
    },
    runOn: {
      type: Schema.Types.Date,
    },
    _jobId: {
      type: Schema.Types.ObjectId,
      ref: 'UserJob',
    },
  },
  { ...schemaOptions }
);

interface IImportJobHistory extends ImportJobHistoryEntity, Document {
  _id: never;
}

export const ImportJobHistory =
  models.ImportJobHistory || model<IImportJobHistory>('ImportJobHistory', importJobHistorySchema);
