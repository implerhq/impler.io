import { Schema, Document, model, models, Model } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { UploadEntity } from './upload.entity';

const uploadSchema = new Schema(
  {
    _templateId: {
      type: Schema.Types.String,
      ref: 'Template',
      index: true,
    },
    _allDataFileId: {
      type: Schema.Types.String,
      ref: 'File',
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
    invalidCSVDataFileUrl: {
      type: Schema.Types.String,
    },
    uploadedDate: {
      type: Schema.Types.Date,
      default: Date.now,
      index: true,
    },
    headings: [String],
    uploadDate: Date,
    totalRecords: Number,
    validRecords: Number,
    invalidRecords: Number,
    authHeaderValue: String,
    status: String,
    extra: String,
    processInvalidRecords: {
      type: Boolean,
      default: false,
    },
  },
  { ...schemaOptions }
);

interface IUploadDocument extends UploadEntity, Document {
  _id: never;
}

export const Upload = (models.Upload as Model<IUploadDocument>) || model<IUploadDocument>('Upload', uploadSchema);
