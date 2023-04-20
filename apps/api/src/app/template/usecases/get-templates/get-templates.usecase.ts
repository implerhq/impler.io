import { Injectable } from '@nestjs/common';
import { TemplateRepository } from '@impler/dal';
import { TemplateResponseDto } from '../../dtos/template-response.dto';

@Injectable()
export class GetTemplates {
  constructor(private templateRepository: TemplateRepository) {}

  async execute(_projectId: string): Promise<TemplateResponseDto[]> {
    const templates = await this.templateRepository.find({ _projectId });

    return templates.map((template) => ({
      _projectId: template._projectId,
      callbackUrl: template.callbackUrl,
      chunkSize: template.chunkSize,
      name: template.name,
      sampleFileUrl: template.sampleFileUrl,
      _id: template._id,
      totalUploads: template.totalUploads,
      totalInvalidRecords: template.totalInvalidRecords,
      totalRecords: template.totalRecords,
    }));
  }
}
