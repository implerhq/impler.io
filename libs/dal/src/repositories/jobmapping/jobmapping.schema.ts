import { model, models, Schema } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { JobMappingEntity } from './jobmapping.entity';

const jobMappingSchema = new Schema(
  {
    _id: {
      type: Schema.Types.String,
    },
    key: {
      type: Schema.Types.String,
    },
    name: {
      type: Schema.Types.String,
    },
    isRequired: {
      type: Schema.Types.Boolean,
    },
    path: {
      type: Schema.Types.String,
    },
    _userJobId: {
      type: Schema.Types.ObjectId,
      ref: 'UserJob',
    },
  },
  { ...schemaOptions }
);

interface IJobMapping extends JobMappingEntity, Document {
  _id: never;
}

export const JobMapping = models.JobMapping || model<IJobMapping>('JobMapping', jobMappingSchema);
