import { UploadRepository } from '@impler/dal';
import { StorageService } from '@impler/shared/dist/services/storage';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUploadProcessInformation {
  constructor(private uploadRepository: UploadRepository, private storageService: StorageService) {}

  async execute(uploadId: string) {
    return await this.uploadRepository.getUploadProcessInformation(uploadId);
  }
}
