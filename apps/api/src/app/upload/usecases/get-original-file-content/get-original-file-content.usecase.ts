import { Readable } from 'stream';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadRepository } from '@impler/dal';
import { StorageService, FileNameService } from '@impler/services';
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
    if (!upload.originalFileName || !upload.originalFileType) {
      throw new NotFoundException();
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
