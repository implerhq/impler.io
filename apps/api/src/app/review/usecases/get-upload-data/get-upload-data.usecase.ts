import { Injectable } from '@nestjs/common';
import { DalService } from '@impler/dal';
import { PaginationResult, ReviewDataTypesEnum } from '@impler/shared';

@Injectable()
export class GetUploadData {
  constructor(private dalService: DalService) {}

  async execute(
    _uploadId: string,
    page: number,
    limit: number,
    totalRecords: number,
    type: ReviewDataTypesEnum
  ): Promise<PaginationResult> {
    const data = await this.dalService.getRecords(_uploadId, page, limit, type);

    return {
      data,
      limit,
      page,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
    };
  }
}
