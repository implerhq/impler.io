import { Injectable } from '@nestjs/common';
import { TemplateRepository } from '@impler/dal';
import { TemplateResponseDto } from 'app/template/dtos/template-response.dto';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class GetTemplateDetails {
  constructor(private templateRepository: TemplateRepository) {}

  async execute(_id: string): Promise<TemplateResponseDto> {
    const template = await this.templateRepository.findOne({ _id });
    if (!template) {
      throw new DocumentNotFoundException('Template', _id);
    }

    return {
      _projectId: template._projectId,
      callbackUrl: template.callbackUrl,
      chunkSize: template.chunkSize,
      name: template.name,
      sampleFileUrl: template.sampleFileUrl,
      _id: template._id,
      totalUploads: template.totalUploads,
      totalInvalidRecords: template.totalInvalidRecords,
      totalRecords: template.totalRecords,
    };
  }
}
