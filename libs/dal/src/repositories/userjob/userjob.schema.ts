import { model, models, Schema } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { UserJobEntity } from './userjob.entity';

const userJobSchema = new Schema(
  {
    _id: {
      type: Schema.Types.String,
    },
    url: {
      type: Schema.Types.String,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
    },
    cron: {
      type: Schema.Types.String,
    },
    headings: {
      type: Schema.Types.String,
    },
    createdOn: {
      type: Schema.Types.Date,
      default: Date.now,
    },
  },
  { ...schemaOptions }
);

interface IUserJobDocument extends UserJobEntity, Document {
  _id: never;
}

export const UserJob = models.UserJobs || model<IUserJobDocument>('Template', userJobSchema);
