import { model, models, Schema } from 'mongoose';
import { FailedWebhookRetryRequestsEntity } from './failed-webhook-retry-requests.entity';
import { schemaOptions } from '../schema-default.options';
const failedWebhookRetryRequestsSchema = new Schema(
  {
    _webhookLogId: {
      type: Schema.Types.ObjectId,
      ref: 'WebhookLog',
      required: true,
    },
    _uploadId: {
      type: Schema.Types.ObjectId,
      ref: 'Upload',
    },
    dataContent: {
      type: Schema.Types.Mixed,
      required: false,
    },
    retryInterval: {
      type: Schema.Types.Number,
      required: false,
      default: 0,
    },
    retryCount: {
      type: Schema.Types.Number,
      required: false,
      default: 0,
    },
    nextRequestTime: {
      type: Schema.Types.Date,
      required: false,
    },
    error: {
      type: Schema.Types.Mixed,
      required: false,
    },
    importName: {
      type: Schema.Types.String,
      required: false,
    },
  },
  { ...schemaOptions }
);
interface IFailedWebhookRetryRequestsDocument extends FailedWebhookRetryRequestsEntity, Document {
  _id: never;
}

export const FailedWebhookRetryRequests =
  models.FailedWebhookRetryRequests ||
  model<IFailedWebhookRetryRequestsDocument>('FailedWebhookRetryRequests', failedWebhookRetryRequestsSchema);
