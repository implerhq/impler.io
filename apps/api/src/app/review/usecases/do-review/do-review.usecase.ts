import { Injectable } from '@nestjs/common';
import { FileEntity, UploadRepository } from '@impler/dal';
import { StorageService } from '../../../shared/storage/storage.service';

@Injectable()
export class DoReview {
  constructor(private uploadRepository: UploadRepository, private storageService: StorageService) {}

  async execute(uploadId: string) {
    const uploadInfo = await this.uploadRepository.getUploadInformation(uploadId);
    const allDataFileInfo = uploadInfo._allDataFileId as unknown as FileEntity;
    const allDataFile = await this.storageService.getFileContent(allDataFileInfo.path, 'utf8');
    console.log(allDataFile);
  }
}
