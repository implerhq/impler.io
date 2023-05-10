import { BaseRepository } from '../base-repository';
import { CustomizationEntity } from './customization.entity';
import { Customization } from './customization.schema';

export class CustomizationRepository extends BaseRepository<CustomizationEntity> {
  constructor() {
    super(Customization, CustomizationEntity);
  }
}
