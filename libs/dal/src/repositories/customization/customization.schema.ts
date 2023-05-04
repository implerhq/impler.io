import { Schema, Document, model, models } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { CustomizationEntity } from './customization.entity';

const customizationSchema = new Schema(
  {
    _templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
      index: true,
    },
    recordVariables: {
      type: [String],
      default: [],
    },
    chunkVariables: {
      type: [String],
      default: [],
    },
    recordFormat: {
      type: String,
      required: true,
    },
    chunkFormat: {
      type: String,
      required: true,
    },
    isRecordFormatUpdated: {
      type: Boolean,
      default: false,
    },
    isChunkFormatUpdated: {
      type: Boolean,
      default: false,
    },
  },
  { ...schemaOptions }
);

interface ICustomizationDocument extends CustomizationEntity, Document {
  _id: never;
}

export const Customization =
  models.Customization || model<ICustomizationDocument>('Customization', customizationSchema);
