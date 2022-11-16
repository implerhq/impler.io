import { Schema, Document, model, models } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { WebhookLogEntity } from './webhook-log.entity';

const webhookSchema = new Schema(
  {
    _uploadId: {
      type: Schema.Types.String,
      ref: 'Upload',
    },
    callDate: Date,
    status: String,
    failedReason: String,
    pageNumber: Number,
    responseStatusCode: Number,
  },
  { ...schemaOptions }
);

interface IWebhookLogDocument extends WebhookLogEntity, Document {
  _id: never;
}

export const WebhookLog = models.WebhookLog || model<IWebhookLogDocument>('WebhookLog', webhookSchema);
