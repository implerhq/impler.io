import { BaseRepository } from '../base-repository';
import { MappingEntity } from './mapping.entity';
import { Mapping } from './mapping.schema';

export class MappingRepository extends BaseRepository<MappingEntity> {
  constructor() {
    super(Mapping, MappingEntity);
  }
}
