import { Injectable, NotFoundException } from '@nestjs/common';
import { TemplateRepository } from '@impler/dal';

@Injectable()
export class DeleteTemplate {
  constructor(private templateRepository: TemplateRepository) {}

  async execute(id: string, _projectId: string) {
    // Verify template belongs to the user's project before deletion (IDOR protection)
    const template = await this.templateRepository.findOne({ _id: id, _projectId });
    if (!template) {
      throw new NotFoundException('Template not found or does not belong to this project');
    }

    return this.templateRepository.delete({ _id: id, _projectId });
  }
}
