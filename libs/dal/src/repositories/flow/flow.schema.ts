import { Schema, Document, model, models } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { FlowEntity } from './flow.entity';

const flowSchema = new Schema(
  {
    name: String,
    _userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { ...schemaOptions }
);

interface IFlowDocument extends FlowEntity, Document {
  _id: never;
}

export const Flow = models.Flow || model<IFlowDocument>('Flow', flowSchema);
