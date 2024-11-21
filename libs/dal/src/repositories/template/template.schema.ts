import { Schema, Document, model, models } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { TemplateEntity } from './template.entity';

const templateSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
    },
    destination: {
      type: Schema.Types.String,
    },
    sampleFileUrl: {
      type: Schema.Types.String,
    },
    _projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
    },
    totalUploads: {
      type: Schema.Types.Number,
      default: 0,
    },
    totalRecords: {
      type: Schema.Types.Number,
      default: 0,
    },
    imageColumns: {
      type: [Schema.Types.String],
      default: [],
    },
    totalInvalidRecords: {
      type: Schema.Types.Number,
      default: 0,
    },
    mode: {
      type: Schema.Types.String,
      default: 'manual',
    },

    integration: {
      type: Schema.Types.String,
    },
  },
  { ...schemaOptions }
);

interface ITemplateDocument extends TemplateEntity, Document {
  _id: never;
}

export const Template = models.Template || model<ITemplateDocument>('Template', templateSchema);
