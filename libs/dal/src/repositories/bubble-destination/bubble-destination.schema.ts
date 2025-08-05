import { Schema, Document, model, models } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { BubbleDestinationEntity } from './bubble-destination.entity';

const bubbleDestinationSchema = new Schema(
  {
    bubbleAppUrl: {
      type: Schema.Types.String,
    },
    _templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
      index: true,
    },
    apiPrivateKey: {
      type: Schema.Types.String,
    },
  },
  { ...schemaOptions }
);

interface IBubbleDestinationDocument extends BubbleDestinationEntity, Document {
  _id: never;
}

export const BubbleDestination =
  models.BubbleDestination || model<IBubbleDestinationDocument>('BubbleDestination', bubbleDestinationSchema);
