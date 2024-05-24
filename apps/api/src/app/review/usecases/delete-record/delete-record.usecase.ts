import { Injectable } from '@nestjs/common';
import { DalService, UploadRepository } from '@impler/dal';

@Injectable()
export class DeleteRecord {
  constructor(
    private dalService: DalService,
    private uploadRepository: UploadRepository
  ) {}

  async execute(_uploadId: string, indexes: number[], valid: number, invalid: number) {
    await this.dalService.deleteRecords(_uploadId, indexes);
    if (typeof valid !== 'undefined' && typeof invalid !== 'undefined') {
      await this.uploadRepository.update(
        {
          _id: _uploadId,
        },
        {
          $inc: {
            totalRecords: -indexes.length,
            validRecords: -valid,
            invalidRecords: -invalid,
          },
        }
      );
    }
  }
}
