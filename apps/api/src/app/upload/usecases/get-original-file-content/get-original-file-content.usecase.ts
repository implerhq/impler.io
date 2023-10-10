import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@impler/dal';
import { FileNameService } from '@shared/services';
import { StorageService } from '@impler/shared/dist/services/storage';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class GetOriginalFileContent {
  constructor(
    private uploadRepository: UploadRepository,
    private storageService: StorageService,
    private fileNameService: FileNameService
  ) {}

  async execute(_uploadId: string): Promise<{ name: string; content: Readable; type: string }> {
    const upload = await this.uploadRepository.findById(_uploadId, 'originalFileName originalFileType');
    if (!upload) {
      throw new DocumentNotFoundException('Upload', _uploadId);
    }
    const content = await this.storageService.getFileStream(
      this.fileNameService.getOriginalFilePath(_uploadId, upload.originalFileName)
    );

    return {
      content,
      name: upload.originalFileName,
      type: upload.originalFileType,
    };
  }
}
