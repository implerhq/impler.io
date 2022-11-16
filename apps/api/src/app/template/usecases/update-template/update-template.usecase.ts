import { Injectable } from '@nestjs/common';
import { TemplateRepository } from '@impler/dal';
import { UpdateTemplateCommand } from './update-template.command';

@Injectable()
export class UpdateTemplate {
  constructor(private templateRepository: TemplateRepository) {}

  async execute(command: UpdateTemplateCommand, id: string) {
    return this.templateRepository.findOneAndUpdate({ _id: id }, command);
  }
}
