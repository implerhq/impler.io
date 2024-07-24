import { FileEncodingsEnum } from '@impler/shared';
import { StorageService } from '@impler/services';
import { Injectable } from '@nestjs/common';
import { paginateRecords } from '@shared/helpers/common.helper';

@Injectable()
export class PaginateFileContent {
  constructor(private storageService: StorageService) {}

  async execute(path: string, page?: number, limit?: number) {
    const fileContent: string = await this.storageService.getFileContent(path, FileEncodingsEnum.JSON);
    const fileData = JSON.parse(fileContent);

    return paginateRecords(fileData, page, limit);
  }
}
