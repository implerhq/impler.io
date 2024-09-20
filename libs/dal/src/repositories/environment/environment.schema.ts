import { Schema, model, models } from 'mongoose';

import { EnvironmentEntity } from './environment.entity';
import { schemaOptions } from '../schema-default.options';

const environmentSchema = new Schema(
  {
    _projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
    },
    key: {
      type: Schema.Types.String,
      unique: true,
    },
    apiKeys: [
      {
        role: String,
        _userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        joinedOn: {
          type: Schema.Types.Date,
          default: Date.now,
        },
      },
    ],
  },
  schemaOptions
);

interface IEnvironmentDocument extends EnvironmentEntity, Document {
  _id: never;
}

export const Environment = models.Environment || model<IEnvironmentDocument>('Environment', environmentSchema);
