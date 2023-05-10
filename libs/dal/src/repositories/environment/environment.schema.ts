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
    apiKeys: [
      {
        key: {
          type: Schema.Types.String,
          unique: true,
        },
        _userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
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
