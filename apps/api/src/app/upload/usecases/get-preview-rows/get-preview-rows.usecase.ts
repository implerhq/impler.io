import * as Papa from 'papaparse';
import { Injectable } from '@nestjs/common';
import { StorageService } from '@impler/services';

@Injectable()
export class GetPreviewRows {
  constructor(private storageServie: StorageService) {}

  async execute(_uploadedFilePath: string) {
    const csvFileStream = await this.storageServie.getFileStream(_uploadedFilePath);

    return new Promise((resolve, reject) => {
      Papa.parse(csvFileStream, {
        dynamicTyping: false,
        skipEmptyLines: true,
        preview: 15,
        complete({ data }) {
          resolve(data);
        },
        error(error) {
          reject(error);
        },
      });
    });
  }
}
