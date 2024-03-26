import { BaseRepository } from '../base-repository';
import { WebhookDestinationEntity } from './webhook-destination.entity';
import { WebhookDestination } from './webhook-destination.schema';

export class WebhookDestinationRepository extends BaseRepository<WebhookDestinationEntity> {
  constructor() {
    super(WebhookDestination, WebhookDestinationEntity);
  }
}
