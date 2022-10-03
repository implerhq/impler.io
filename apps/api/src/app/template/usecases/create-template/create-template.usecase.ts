import { Injectable } from '@nestjs/common';
import { TemplateRepository } from '@impler/dal';
import { CreateTemplateCommand } from './create-template.command';

@Injectable()
export class CreateTemplate {
  constructor(private templateRepository: TemplateRepository) {}

  async execute(command: CreateTemplateCommand) {
    return this.templateRepository.create(command);
  }
}
