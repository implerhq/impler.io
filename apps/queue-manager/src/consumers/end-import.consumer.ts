import { DalService } from '@impler/dal';
import { StorageService } from '@impler/shared/dist/services/storage';
import { EndImportData, FileNameService, FileMimeTypesEnum, QueuesEnum } from '@impler/shared';

import { BaseConsumer } from './base.consumer';
import { publishToQueue } from '../bootstrap';
import { getStorageServiceClass } from '../helpers/storage.helper';

export class EndImportConsumer extends BaseConsumer {
  private dalService: DalService = new DalService();
  private fileNameService: FileNameService = new FileNameService();
  private storageService: StorageService = getStorageServiceClass();

  async message(message: { content: string }) {
    const data = JSON.parse(message.content) as EndImportData;
    await this.convertRecordsToJsonFile(data.uploadId);

    publishToQueue(QueuesEnum.SEND_WEBHOOK_DATA, {
      uploadId: data.uploadId,
    });
  }

  private async convertRecordsToJsonFile(uploadId: string) {
    const importData = await this.dalService.getAllRecords(uploadId);
    const allJsonDataFilePath = this.fileNameService.getAllJsonDataFilePath(uploadId);
    await this.storageService.uploadFile(allJsonDataFilePath, JSON.stringify(importData), FileMimeTypesEnum.JSON);
    await this.dalService.dropRecordCollection(uploadId);
  }
}
