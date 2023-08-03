import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@impler/dal';
import { UploadStatusEnum } from '@impler/shared';

@Injectable()
export class FinalizeUpload {
  constructor(private uploadRepository: UploadRepository) {}

  async execute(_uploadId: string, headings: string[]) {
    return await this.uploadRepository.findOneAndUpdate(
      { _id: _uploadId },
      { status: UploadStatusEnum.MAPPED, headings }
    );
  }
}
