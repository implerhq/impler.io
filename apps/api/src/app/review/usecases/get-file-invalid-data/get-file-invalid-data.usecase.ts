import { Injectable } from '@nestjs/common';
import { FileEncodingsEnum } from '@impler/shared';
import { StorageService } from '@impler/shared';

@Injectable()
export class GetFileInvalidData {
  constructor(private storageService: StorageService) {}

  async execute(path: string) {
    const stringContent = await this.storageService.getFileContent(path, FileEncodingsEnum.JSON);

    return JSON.parse(stringContent);
  }
}
