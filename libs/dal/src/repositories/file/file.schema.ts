import { Schema, Document, model, models } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { FileEntity } from './file.entity';

const fileSchema = new Schema(
  {
    name: String,
    originalName: String,
    mimeType: String,
    path: String,
  },
  { ...schemaOptions }
);

interface IFileDocument extends FileEntity, Document {
  _id: never;
}

export const File = models.File || model<IFileDocument>('File', fileSchema);
