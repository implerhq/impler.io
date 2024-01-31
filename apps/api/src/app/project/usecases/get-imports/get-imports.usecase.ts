import { Injectable } from '@nestjs/common';
import { GetImportsCommand } from './get-imports.command';
import { TemplateRepository, CommonRepository } from '@impler/dal';
import { ImportListResponseDto } from 'app/project/dtos/import-list-response.dto';
import { PaginationResult } from '@impler/shared';

@Injectable()
export class GetImports {
  constructor(private templateRepository: TemplateRepository, private commonRepository: CommonRepository) {}

  async execute({ _projectId, limit, page }: GetImportsCommand): Promise<PaginationResult<ImportListResponseDto>> {
    const imports = await this.templateRepository.paginate(
      {
        _projectId: this.commonRepository.generateMongoId(_projectId),
      },
      'name totalUploads totalRecords totalInvalidRecords',
      {
        skip: limit * (page - 1),
        limit,
      }
    );

    return {
      page,
      limit,
      data: imports.data,
      totalPages: Math.ceil(imports.total / limit),
      totalRecords: imports.total,
    };
  }
}
