import { Schema, Document, model, models } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { ColumnEntity } from './column.entity';

const columnSchema = new Schema(
  {
    name: String,
    columnKeys: [String],
    isRequired: Boolean,
    isUnique: Boolean,
    regex: String,
    regexDescription: String,
    selectValues: [String],
    sequence: Number,
    templateId: {
      type: Schema.Types.String,
      ref: 'Template',
    },
    type: String,
  },
  { ...schemaOptions }
);

interface IColumnDocument extends ColumnEntity, Document {
  _id: never;
}

export const Column = models.Column || model<IColumnDocument>('Column', columnSchema);
