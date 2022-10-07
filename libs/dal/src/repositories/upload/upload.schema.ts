import { Schema, Document, model, models } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { UploadEntity } from './upload.entity';

const uploadSchema = new Schema(
  {
    _templateId: {
      type: Schema.Types.String,
      ref: 'Template',
    },
    _uploadedFileId: {
      type: Schema.Types.String,
      ref: 'File',
    },
    _validDataFileId: {
      type: Schema.Types.String,
      ref: 'File',
    },
    _invalidDataFileId: {
      type: Schema.Types.String,
      ref: 'File',
    },
    headings: [String],
    uploadDate: Date,
    totalRecords: Number,
    validRecords: String,
    invalidRecords: String,
    authHeaderValue: String,
    status: String,
    extra: String,
  },
  { ...schemaOptions }
);

interface IUploadDocument extends UploadEntity, Document {
  _id: never;
}

export const Upload = models.Upload || model<IUploadDocument>('Upload', uploadSchema);
