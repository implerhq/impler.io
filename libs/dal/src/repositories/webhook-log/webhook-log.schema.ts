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
    error: Schema.Types.Mixed,
    failedReason: String,
    pageNumber: Number,
    responseStatusCode: Number,
    dataContent: {
      type: String,
      get: function (data: any) {
        try {
          return JSON.parse(data);
        } catch (err) {
          return data;
        }
      },
      set: function (data: any) {
        return JSON.stringify(data);
      },
    },
    headerContent: {
      type: String,
      get: function (data: any) {
        try {
          return JSON.parse(data);
        } catch (err) {
          return data;
        }
      },
      set: function (data: any) {
        return JSON.stringify(data);
      },
    },
  },
  { ...schemaOptions }
);

interface IWebhookLogDocument extends WebhookLogEntity, Document {
  _id: never;
}

export const WebhookLog = models.WebhookLog || model<IWebhookLogDocument>('WebhookLog', webhookSchema);
