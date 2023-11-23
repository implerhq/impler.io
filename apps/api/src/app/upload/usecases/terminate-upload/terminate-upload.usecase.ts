import { Injectable } from '@nestjs/common';
import { DalService, UploadRepository } from '@impler/dal';
import { UploadStatusEnum } from '@impler/shared';

@Injectable()
export class TerminateUpload {
  constructor(private uploadRepository: UploadRepository, private dalService: DalService) {}

  async execute(_uploadId: string) {
    const upload = await this.uploadRepository.findOneAndUpdate(
      {
        _id: _uploadId,
      },
      {
        status: UploadStatusEnum.TERMINATED,
      }
    );
    if (upload) {
      await this.dalService.dropRecordCollection(_uploadId);
    }

    return upload;
  }
}
