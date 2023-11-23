import { EndImportData, FileNameService, FileMimeTypesEnum, QueuesEnum } from '@impler/shared';
import { StorageService } from '@impler/shared/dist/services/storage';
import { FileEntity, DalService, FileRepository } from '@impler/dal';

import { BaseConsumer } from './base.consumer';
import { getStorageServiceClass } from '../helpers/storage.helper';
import { publishToQueue } from '../bootstrap';

export class EndImportConsumer extends BaseConsumer {
  private dalService: DalService = new DalService();
  private fileRepository: FileRepository = new FileRepository();
  private fileNameService: FileNameService = new FileNameService();
  private storageService: StorageService = getStorageServiceClass();

  async message(message: { content: string }) {
    const data = JSON.parse(message.content) as EndImportData;
    const importData = await this.dalService.getAllRecords(data.uploadId);
    await this.makeFileEntry(data.uploadId, importData);
    await this.dalService.dropRecordCollection(data.uploadId);

    publishToQueue(QueuesEnum.PROCESS_FILE, {
      uploadId: data.uploadId,
    });
  }

  private async makeFileEntry(uploadId: string, data: any[]): Promise<FileEntity> {
    const allJsonDataFilePath = this.fileNameService.getAllJsonDataFilePath(uploadId);
    await this.storageService.uploadFile(allJsonDataFilePath, JSON.stringify(data), FileMimeTypesEnum.JSON);
    const jsonDataFileName = this.fileNameService.getAllJsonDataFileName();
    const fileEntry = await this.fileRepository.create({
      mimeType: FileMimeTypesEnum.CSV,
      name: jsonDataFileName,
      originalName: jsonDataFileName,
      path: allJsonDataFilePath,
    });

    return fileEntry;
  }
}
