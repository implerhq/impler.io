import { BaseRepository } from '../base-repository';
import { ValidatorEntity } from './validator.entity';
import { Validator } from './validator.schema';

export class ValidatorRepository extends BaseRepository<ValidatorEntity> {
  constructor() {
    super(Validator, ValidatorEntity);
  }
}
