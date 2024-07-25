import { model, models, Schema } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { UserJobEntity } from './user-job.entity';

const userJobSchema = new Schema(
  {
    url: {
      type: Schema.Types.String,
    },
    _templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
    },
    cron: {
      type: Schema.Types.String,
    },
    headings: {
      type: [Schema.Types.String],
    },
    extra: {
      type: Schema.Types.String,
    },
    externalUserId: {
      type: Schema.Types.String,
    },
    status: {
      type: Schema.Types.String,
    },
    customRecordFormat: {
      type: Schema.Types.String,
    },
    customChunkFormat: {
      type: Schema.Types.String,
    },
    customSchema: {
      type: Schema.Types.String,
    },
  },
  { ...schemaOptions }
);

interface IUserJobDocument extends UserJobEntity, Document {
  _id: never;
}

export const UserJob = models.UserJob || model<IUserJobDocument>('UserJob', userJobSchema);
