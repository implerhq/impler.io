import { Injectable } from '@nestjs/common';
import { FileRepository, UploadRepository } from '@impler/dal';
import { FileMimeTypesEnum } from '@impler/shared';
import { FileNameService } from '../../../shared/file/name.service';
import { StorageService } from '../../../shared/storage/storage.service';

@Injectable()
export class SaveReviewData {
  constructor(
    private fileNameService: FileNameService,
    private storageService: StorageService,
    private fileRepository: FileRepository,
    private uploadRepository: UploadRepository
  ) {}

  async execute(_uploadId: string, invalidData: any[], validData: any[]) {
    const _invalidDataFileId = await this.storeInvalidFile(_uploadId, invalidData);
    const _validDataFileId = await this.storeValidFile(_uploadId, validData);
    await this.uploadRepository.update({ _id: _uploadId }, { _invalidDataFileId, _validDataFileId });
  }

  private async storeValidFile(_uploadId: string, validData: any[]): Promise<string> {
    if (validData.length < 1) return null;

    const strinValidData = JSON.stringify(validData);
    const validFilePath = this.fileNameService.getValidDataFilePath(_uploadId);
    await this.storeFile(validFilePath, strinValidData);
    const validFileName = this.fileNameService.getValidDataFileName();
    const entry = await this.makeFileEntry(validFileName, validFilePath);

    return entry._id;
  }

  private async storeInvalidFile(_uploadId: string, invalidData: any[]): Promise<string> {
    if (invalidData.length < 1) return null;

    const stringInvalidData = JSON.stringify(invalidData);
    const invalidFilePath = this.fileNameService.getInvalidDataFilePath(_uploadId);
    await this.storeFile(invalidFilePath, stringInvalidData);
    const invalidFileName = this.fileNameService.getInvalidDataFileName();
    const entry = await this.makeFileEntry(invalidFileName, invalidFilePath);

    return entry._id;
  }

  private async storeFile(invalidFilePath: string, data: string) {
    await this.storageService.uploadFile(invalidFilePath, data, FileMimeTypesEnum.JSON);
  }

  private async makeFileEntry(fileName: string, filePath: string) {
    return await this.fileRepository.create({
      mimeType: FileMimeTypesEnum.JSON,
      name: fileName,
      originalName: fileName,
      path: filePath,
    });
  }
}
