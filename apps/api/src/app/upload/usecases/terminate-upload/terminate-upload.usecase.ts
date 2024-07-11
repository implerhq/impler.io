import { Injectable } from '@nestjs/common';
import { DalService, UploadRepository } from '@impler/dal';
import { UploadStatusEnum } from '@impler/shared';

@Injectable()
export class TerminateUpload {
  constructor(
    private uploadRepository: UploadRepository,
    private dalService: DalService
  ) {}

  async execute(_uploadId: string) {
    const upload = await this.uploadRepository.findOne(
      {
        _id: _uploadId,
      },
      'status'
    );
    if (upload) {
      await this.uploadRepository.update({ _id: _uploadId }, { status: UploadStatusEnum.TERMINATED });
      if ([UploadStatusEnum.MAPPED, UploadStatusEnum.REVIEWING].includes(upload.status as UploadStatusEnum)) {
        await this.dalService.dropRecordCollection(_uploadId);
      }
      upload.status = UploadStatusEnum.TERMINATED;
    }

    return upload;
  }
}
