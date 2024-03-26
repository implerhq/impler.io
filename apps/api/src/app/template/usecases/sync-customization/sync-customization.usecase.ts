import { Injectable } from '@nestjs/common';

import { TemplateRepository } from '@impler/dal';
import { UpdateCustomization } from '../update-customization/update-customization.usecase';

@Injectable()
export class SyncCustomization {
  constructor(private templateRepository: TemplateRepository, private updateCustomization: UpdateCustomization) {}

  async execute(_templateId: string) {
    const template = await this.templateRepository.findById(_templateId, 'destination');

    return this.updateCustomization.createOrReset(_templateId, { destination: template.destination });
  }
}
