import { Injectable } from '@nestjs/common';
import { DalService } from '@impler/dal';
import { PaginationResult } from '@impler/shared';

@Injectable()
export class GetUploadData {
  constructor(private dalService: DalService) {}

  async execute(_uploadId: string, page: number, limit: number, totalRecords: number): Promise<PaginationResult> {
    const data = await this.dalService.getRecords(_uploadId, page, limit);

    return {
      data,
      limit,
      page,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
    };
  }
}
