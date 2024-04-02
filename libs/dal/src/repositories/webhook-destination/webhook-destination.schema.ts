import { Schema, Document, model, models } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { WebhookDestinationEntity } from './webhook-destination.entity';

const webhookDestinationSchema = new Schema(
  {
    callbackUrl: {
      type: Schema.Types.String,
    },
    authHeaderName: {
      type: Schema.Types.String,
    },
    chunkSize: {
      type: Schema.Types.Number,
    },
    _templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
      index: true,
    },
  },
  { ...schemaOptions }
);

interface IWebhookDestinationDocument extends WebhookDestinationEntity, Document {
  _id: never;
}

export const WebhookDestination =
  models.WebhookDestination || model<IWebhookDestinationDocument>('WebhookDestination', webhookDestinationSchema);
