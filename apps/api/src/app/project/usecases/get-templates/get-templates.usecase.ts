import { Injectable } from '@nestjs/common';
import { TemplateRepository, CommonRepository } from '@impler/dal';
import { WidgetTemplateResponseDto } from 'app/template/dtos/widget-templates-response.dto';

@Injectable()
export class GetTemplates {
  constructor(private templateRepository: TemplateRepository, private commonRepository: CommonRepository) {}

  async execute(_projectId: string): Promise<WidgetTemplateResponseDto[]> {
    const templates = await this.templateRepository.aggregate([
      {
        $match: {
          _projectId: this.commonRepository.generateMongoId(_projectId),
        },
      },
      { $addFields: { templateId: { $toString: '$_id' } } },
      {
        $lookup: {
          from: 'columns',
          localField: 'templateId',
          foreignField: '_templateId',
          as: 'columns',
          pipeline: [
            {
              $project: {
                _id: 1,
              },
            },
          ],
        },
      },
    ]);

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
      authHeaderName: template.authHeaderName,
      totalColumns: template.columns?.length,
    }));
  }
}
