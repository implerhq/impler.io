import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@impler/dal';
import { PaginationResult } from '@impler/shared';
import { UploadHistoryCommand } from './upload-history.command';

@Injectable()
export class UploadHistory {
  constructor(private uploadRepository: UploadRepository) {}

  async execute({ _projectId, date, limit, name, page }: UploadHistoryCommand): Promise<PaginationResult> {
    const uploadResult = await this.uploadRepository.getList(_projectId, name, date, page, limit);

    const transformedRecords = uploadResult.uploads.map((record) => ({
      ...record,
      name: record._template?.name,
      _template: undefined,
    }));

    return {
      data: transformedRecords,
      limit,
      page,
      totalPages: Math.ceil(uploadResult.totalRecords / limit),
      totalRecords: uploadResult.totalRecords,
    };
  }
}
