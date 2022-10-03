import { Injectable } from '@nestjs/common';
import { TemplateRepository } from '@impler/dal';
import { TemplateResponseDto } from '../../dtos/template-response.dto';

@Injectable()
export class GetTemplates {
  constructor(private templateRepository: TemplateRepository) {}

  async execute(projectId: string): Promise<TemplateResponseDto[]> {
    const templates = await this.templateRepository.find({ projectId });

    return templates.map((template) => ({
      _projectId: template._projectId,
      callbackUrl: template.callbackUrl,
      chunkSize: template.chunkSize,
      code: template.code,
      name: template.name,
      _id: template._id,
    }));
  }
}
