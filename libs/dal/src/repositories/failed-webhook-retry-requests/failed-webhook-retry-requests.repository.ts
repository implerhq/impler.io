import { BaseRepository } from '../base-repository';
import { FailedWebhookRetryRequestsEntity } from './failed-webhook-retry-requests.entity';
import { FailedWebhookRetryRequests } from './failed-webhook-retry-requests.schema';

export class FailedWebhookRetryRequestsRepository extends BaseRepository<FailedWebhookRetryRequestsEntity> {
  constructor() {
    super(FailedWebhookRetryRequests, FailedWebhookRetryRequestsEntity);
  }
}
