import { Injectable } from '@nestjs/common';
import { TemplateRepository } from '@impler/dal';
import { TemplateResponseDto } from 'app/template/dtos/template-response.dto';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';
import { IntegrationEnum } from '@impler/shared';

@Injectable()
export class GetTemplateDetails {
  constructor(private templateRepository: TemplateRepository) {}

  async execute({
    _projectId,
    _templateId,
  }: {
    _templateId: string;
    _projectId: string;
  }): Promise<TemplateResponseDto> {
    const template = await this.templateRepository.findOne(
      { _id: _templateId, _projectId },
      '_projectId name sampleFileUrl _id totalUploads totalInvalidRecords totalRecords mode integration'
    );
    if (!template) {
      throw new DocumentNotFoundException('Template', _templateId);
    }

    return {
      _id: template._id,
      name: template.name,
      _projectId: template._projectId,
      sampleFileUrl: template.sampleFileUrl,
      totalUploads: template.totalUploads,
      totalInvalidRecords: template.totalInvalidRecords,
      totalRecords: template.totalRecords,
      mode: template.mode,
      integration: template.integration as IntegrationEnum,
    };
  }
}
