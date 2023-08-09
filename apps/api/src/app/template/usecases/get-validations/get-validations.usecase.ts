import { Injectable } from '@nestjs/common';
import { ValidatorRepository } from '@impler/dal';

@Injectable()
export class GetValidations {
  constructor(private validatorRepository: ValidatorRepository) {}

  async execute(_templateId: string) {
    return this.validatorRepository.findOne({ _templateId });
  }
}
