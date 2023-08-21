import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@impler/dal';
import { PaginationResult } from '@impler/shared';

@Injectable()
export class UploadHistory {
  constructor(private uploadRepository: UploadRepository) {}

  async execute(
    _projectId: string,
    name?: string,
    date?: string,
    page?: number,
    limit?: number
  ): Promise<PaginationResult> {
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
