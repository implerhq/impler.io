import { Schema, Document, model, models } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { TemplateEntity } from './template.entity';

const templateSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
    },
    code: {
      type: Schema.Types.String,
    },
    callbackUrl: {
      type: Schema.Types.String,
    },
    chunkSize: {
      type: Schema.Types.Number,
    },
    _projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
    },
  },
  { ...schemaOptions }
);

interface ITemplateDocument extends TemplateEntity, Document {
  _id: never;
}

export const Template = models.Template || model<ITemplateDocument>('Template', templateSchema);
