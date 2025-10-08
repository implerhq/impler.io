import { model, models, Schema, Model } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { UserJobEntity } from './user-job.entity';
import { FilterOperationEnum } from '@impler/shared';

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

    nextRun: {
      type: Schema.Types.Date,
    },

    endsOn: {
      type: Schema.Types.Date,
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
    authHeaderValue: {
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
    isInvalidRecords: {
      type: Schema.Types.Boolean,
      default: false,
    },
    totalRecords: {
      type: Schema.Types.Number,
      default: 0,
    },
    validRecords: {
      type: Schema.Types.Number,
      default: 0,
    },
    invalidRecords: {
      type: Schema.Types.Number,
      default: 0,
    },
    filters: {
      type: [
        {
          field: { type: Schema.Types.String },
          operation: {
            type: Schema.Types.String,
            enum: Object.values(FilterOperationEnum),
          },
          value: { type: Schema.Types.String },
        },
      ],
      default: [],
    },
  },
  { ...schemaOptions }
);

interface IUserJobDocument extends UserJobEntity, Document {
  _id: never;
}

export const UserJob = (models.UserJob as Model<IUserJobDocument>) || model<IUserJobDocument>('UserJob', userJobSchema);
