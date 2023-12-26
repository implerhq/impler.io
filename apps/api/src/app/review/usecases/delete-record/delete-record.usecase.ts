import { Injectable } from '@nestjs/common';
import { DalService, UploadRepository } from '@impler/dal';

@Injectable()
export class DeleteRecord {
  constructor(private dalService: DalService, private uploadRepository: UploadRepository) {}

  async execute(_uploadId: string, index: number, isValid?: boolean) {
    await this.dalService.deleteRecord(_uploadId, index);
    if (typeof isValid !== 'undefined') {
      await this.uploadRepository.update(
        {
          _id: _uploadId,
        },
        {
          $inc: {
            totalRecords: -1,
            validRecords: isValid ? -1 : 0,
            invalidRecords: isValid ? 0 : -1,
          },
        }
      );
    }
  }
}
