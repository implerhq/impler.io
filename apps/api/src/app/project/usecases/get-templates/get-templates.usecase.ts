import { Injectable } from '@nestjs/common';
import { TemplateRepository, CommonRepository } from '@impler/dal';
import { TemplateListResponseDto } from 'app/project/dtos/template-list-response.dto';

@Injectable()
export class GetTemplates {
  constructor(private templateRepository: TemplateRepository, private commonRepository: CommonRepository) {}

  async execute(_projectId: string): Promise<TemplateListResponseDto[]> {
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
      _id: template._id,
      name: template.name,
      sampleFileUrl: template.sampleFileUrl,
      totalColumns: template.columns?.length,
    }));
  }
}
