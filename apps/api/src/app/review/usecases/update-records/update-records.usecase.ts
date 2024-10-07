import { Injectable } from '@nestjs/common';
import { DalService, UploadRepository } from '@impler/dal';
import { UpdateRecordCommand } from '../update-record/update-record.command';

@Injectable()
export class UpdateRecords {
  constructor(
    private dalService: DalService,
    private uploadRepository: UploadRepository
  ) {}

  async execute(_uploadId: string, data: UpdateRecordCommand[]) {
    const result = await this.dalService.updateRecords(_uploadId, data);
    await this.uploadRepository.update(
      {
        _id: _uploadId,
      },
      {
        $inc: {
          totalRecords: result.upsertedCount,
          invalidRecords: result.upsertedCount,
        },
      }
    );
  }
}
