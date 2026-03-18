import { Injectable, Logger } from '@nestjs/common';
import { UploadRepository } from '@impler/dal';
import { PaginationResult } from '@impler/shared';
import { UploadHistoryCommand } from './upload-history.command';

@Injectable()
export class UploadHistory {
  private readonly logger = new Logger(UploadHistory.name);

  constructor(private uploadRepository: UploadRepository) {}

  async execute({ _projectId, date, limit, name, page }: UploadHistoryCommand): Promise<PaginationResult> {
    this.logger.log(
      `[execute] Querying uploads — _projectId=${_projectId}, name=${name ?? ''}, date=${
        date ?? ''
      }, page=${page}, limit=${limit}`
    );
    const uploadResult = await this.uploadRepository.getList(_projectId, name, date, page, limit);
    this.logger.log(
      `[execute] DB result — totalRecords=${uploadResult.totalRecords}, returned=${uploadResult.uploads?.length}`
    );

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
