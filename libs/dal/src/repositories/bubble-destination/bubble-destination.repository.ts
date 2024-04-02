import { BaseRepository } from '../base-repository';
import { BubbleDestinationEntity } from './bubble-destination.entity';
import { BubbleDestination } from './bubble-destination.schema';

export class BubbleDestinationRepository extends BaseRepository<BubbleDestinationEntity> {
  constructor() {
    super(BubbleDestination, BubbleDestinationEntity);
  }
}
