import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@impler/dal';

@Injectable()
export class GetUploadColumns {
  constructor(private uploadRepository: UploadRepository) {}

  async execute(_uploadId: string) {
    const upload = await this.uploadRepository.findById(_uploadId, 'customSchema');

    return JSON.parse(upload.customSchema);
  }
}
