import { BaseRepository } from '../base-repository';
import { FlowEntity } from './flow.entity';
import { Flow } from './flow.schema';

export class FlowRepository extends BaseRepository<FlowEntity> {
  constructor() {
    super(Flow, FlowEntity);
  }
}
