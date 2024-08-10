import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@impler/dal';
import { FileNameService, StorageService } from '@impler/services';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class GetAsset {
  constructor(
    private uploadRepository: UploadRepository,
    private storageService: StorageService,
    private fileNameService: FileNameService
  ) {}

  async execute(_uploadId: string, name: string): Promise<Readable> {
    const upload = await this.uploadRepository.findById(_uploadId, '_id');
    if (!upload) {
      throw new DocumentNotFoundException('Upload', _uploadId);
    }

    try {
      return await this.storageService.getFileStream(this.fileNameService.getAssetFilePath(_uploadId, name));
    } catch (error) {
      throw new DocumentNotFoundException('Asset', name);
    }
  }
}
