import { Injectable } from '@nestjs/common';
import { TemplateRepository, CustomizationRepository } from '@impler/dal';
import { CreateTemplateCommand } from './create-template.command';
import { CONSTANTS } from '@shared/constants';

@Injectable()
export class CreateTemplate {
  constructor(
    private templateRepository: TemplateRepository,
    private customizationRepository: CustomizationRepository
  ) {}

  async execute(command: CreateTemplateCommand) {
    const template = await this.templateRepository.create(command);
    await this.customizationRepository.create({
      _templateId: template._id,
      chunkFormat: CONSTANTS.CHUNK_FORMAT,
      combinedFormat: CONSTANTS.COMBINED_FORMAT,
      recordFormat: '{}',
      chunkVariables: CONSTANTS.CHUNK_VARIABLES,
    });

    return template;
  }
}
