import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';
import { FileRepository, UploadRepository } from '@impler/dal';
import { FileMimeTypesEnum } from '@impler/shared';
import { FileNameService } from '@shared/services/file';
import { Defaults } from '@impler/shared';
import { StorageService } from '@impler/shared/dist/services/storage';

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
    const _invalidCSVDataFileId = await this.storeInvalidCSVFile(_uploadId, invalidData);
    const invalidCSVDataFileUrl = this.fileNameService.getInvalidCSVDataFileUrl(_uploadId);
    await this.uploadRepository.update(
      { _id: _uploadId },
      { _invalidDataFileId, _validDataFileId, _invalidCSVDataFileId, invalidCSVDataFileUrl }
    );
  }

  private async storeValidFile(_uploadId: string, validData: any[]): Promise<string> {
    if (validData.length < Defaults.ONE) return null;

    const strinValidData = JSON.stringify(validData);
    const validFilePath = this.fileNameService.getValidDataFilePath(_uploadId);
    await this.storeFile(validFilePath, strinValidData);
    const validFileName = this.fileNameService.getValidDataFileName();
    const entry = await this.makeFileEntry(validFileName, validFilePath);

    return entry._id;
  }

  private async storeInvalidFile(_uploadId: string, invalidData: any[]): Promise<string> {
    if (invalidData.length < Defaults.ONE) return null;

    const stringInvalidData = JSON.stringify(invalidData);
    const invalidFilePath = this.fileNameService.getInvalidDataFilePath(_uploadId);
    await this.storeFile(invalidFilePath, stringInvalidData);
    const invalidFileName = this.fileNameService.getInvalidDataFileName();
    const entry = await this.makeFileEntry(invalidFileName, invalidFilePath);

    return entry._id;
  }

  private async storeInvalidCSVFile(_uploadId: string, invalidData: any[]): Promise<string> {
    if (invalidData.length < Defaults.ONE) return null;

    const ws = XLSX.utils.json_to_sheet(invalidData);
    const invalidCSVDataContent = XLSX.utils.sheet_to_csv(ws, { FS: ',' });

    const invalidCSVFilePath = this.fileNameService.getInvalidCSVDataFilePath(_uploadId);
    await this.storeFile(invalidCSVFilePath, invalidCSVDataContent);
    const invalidCSVFileName = this.fileNameService.getInvalidCSVDataFileName();
    const entry = await this.makeFileEntry(invalidCSVFileName, invalidCSVFilePath);

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
