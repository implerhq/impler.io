import { BaseRepository } from '../base-repository';
import { WebhookLogEntity } from './webhook-log.entity';
import { WebhookLog } from './webhook-log.schema';

export class WebhookLogRepository extends BaseRepository<WebhookLogEntity> {
  constructor() {
    super(WebhookLog, WebhookLogEntity);
  }
}
