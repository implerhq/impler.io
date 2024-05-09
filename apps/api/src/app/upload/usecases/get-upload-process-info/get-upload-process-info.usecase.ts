import { UploadRepository } from '@impler/dal';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUploadProcessInformation {
  constructor(private uploadRepository: UploadRepository) {}

  async execute(uploadId: string) {
    return await this.uploadRepository.getUploadProcessInformation(uploadId);
  }
}
