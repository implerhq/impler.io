import { Injectable } from '@nestjs/common';
import { TemplateRepository } from '@impler/dal';

@Injectable()
export class DeleteTemplate {
  constructor(private templateRepository: TemplateRepository) {}

  async execute(id: string) {
    return this.templateRepository.delete({ _id: id });
  }
}
