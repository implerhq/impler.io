import { Schema, Document, model, models, Model } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { ValidatorEntity } from './validator.entity';

const validatorSchema = new Schema(
  {
    _templateId: {
      type: Schema.Types.String,
      ref: 'Template',
      index: true,
    },
    onBatchInitialize: String,
  },
  { ...schemaOptions }
);

interface IValidatorDocument extends ValidatorEntity, Document {
  _id: never;
}

export const Validator =
  (models.Validator as Model<IValidatorDocument>) || model<IValidatorDocument>('Validator', validatorSchema);
