import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@impler/dal';

@Injectable()
export class GetUploadInvalidData {
  constructor(private uploadRepository: UploadRepository) {}

  async execute(_uploadId: string) {
    return this.uploadRepository.getUploadInvalidDataInformation(_uploadId);
  }
}
