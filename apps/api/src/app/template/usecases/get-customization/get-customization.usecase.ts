import { Injectable } from '@nestjs/common';
import { CustomizationRepository } from '@impler/dal';

@Injectable()
export class GetCustomization {
  constructor(private customizationRepository: CustomizationRepository) {}

  async execute(_templateId: string) {
    return this.customizationRepository.findOne({ _templateId });
  }
}
