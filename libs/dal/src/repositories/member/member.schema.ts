import { Schema, Document, models, model, Model } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { MemberEntity } from './member.entity';

const memberSchema = new Schema(
  {
    _userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    role: String,
    _projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
    },
  },
  schemaOptions
);

interface IMemberDocument extends MemberEntity, Document {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id: any;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Member = (models.Member as Model<IMemberDocument>) || model<IMemberDocument>('Member', memberSchema);
