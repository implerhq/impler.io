import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@impler/dal';
import { PaginationResult } from '@impler/shared';
import { UploadHistoryCommand } from './upload-history.command';

@Injectable()
export class UploadHistory {
  constructor(private uploadRepository: UploadRepository) {}

  async execute({ _projectId, date, limit, name, page }: UploadHistoryCommand): Promise<PaginationResult> {
    const uploadResult = await this.uploadRepository.getList(_projectId, name, date, page, limit);
    uploadResult.uploads = uploadResult.uploads.map((upload) => {
      upload.name = upload._template.name;
      delete upload._template;

      return upload;
    });

    return {
      data: uploadResult.uploads,
      limit,
      page,
      totalPages: Math.ceil(uploadResult.totalRecords / limit),
      totalRecords: uploadResult.totalRecords,
    };
  }
}
