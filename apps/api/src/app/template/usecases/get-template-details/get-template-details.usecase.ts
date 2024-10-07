import { Injectable } from '@nestjs/common';
import { TemplateRepository } from '@impler/dal';
import { TemplateResponseDto } from 'app/template/dtos/template-response.dto';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';
import { IntegrationEnum } from '@impler/shared';

@Injectable()
export class GetTemplateDetails {
  constructor(private templateRepository: TemplateRepository) {}

  async execute(_id: string): Promise<TemplateResponseDto> {
    const template = await this.templateRepository.findOne(
      { _id },
      '_projectId name sampleFileUrl _id totalUploads totalInvalidRecords totalRecords mode integration'
    );
    if (!template) {
      throw new DocumentNotFoundException('Template', _id);
    }

    return {
      _projectId: template._projectId,
      name: template.name,
      sampleFileUrl: template.sampleFileUrl,
      _id: template._id,
      totalUploads: template.totalUploads,
      totalInvalidRecords: template.totalInvalidRecords,
      totalRecords: template.totalRecords,
      mode: template.mode,
      integration: template.integration as IntegrationEnum,
    };
  }
}
