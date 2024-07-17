import { model, models, Schema } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { UserJobEntity } from './userjob.entity';

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
  },
  { ...schemaOptions }
);

interface IUserJobDocument extends UserJobEntity, Document {
  _id: never;
}

export const UserJob = models.UserJob || model<IUserJobDocument>('UserJob', userJobSchema);
