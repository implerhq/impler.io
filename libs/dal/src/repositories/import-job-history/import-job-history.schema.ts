import { model, models, Schema, Model } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { ImportJobHistoryEntity } from './import-job-history.entity';

const importJobHistorySchema = new Schema(
  {
    _jobId: {
      type: Schema.Types.ObjectId,
      ref: 'UserJob',
    },
    allDataFilePath: {
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
      default: Date.now,
    },
  },
  { ...schemaOptions }
);

interface IImportJobHistoryDocument extends ImportJobHistoryEntity, Document {
  _id: never;
}

export const ImportJobHistory =
  (models.ImportJobHistory as Model<IImportJobHistoryDocument>) ||
  model<IImportJobHistoryDocument>('ImportJobHistory', importJobHistorySchema);
