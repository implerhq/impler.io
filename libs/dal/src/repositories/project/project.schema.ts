import { Schema, Document, model, models, Model } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { ProjectEntity } from './project.entity';

const projectSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
    },
    _userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    showBranding: {
      type: Schema.Types.Boolean,
      default: true,
    },
  },
  { ...schemaOptions }
);

interface IProjectDocument extends ProjectEntity, Document {
  _id: never;
}

export const Project = (models.Project as Model<IProjectDocument>) || model<IProjectDocument>('Project', projectSchema);
