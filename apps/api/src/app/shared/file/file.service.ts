import { IFileInformation } from '@impler/shared';
import { ParserOptionsArgs, parseString } from 'fast-csv';
import { StorageService } from '../storage/storage.service';

export abstract class FileService {
  abstract getFileInformation(storageService: StorageService, storageKey: string): Promise<IFileInformation>;
}

export class CSVFileService extends FileService {
  async getFileInformation(storageService: StorageService, storageKey: string): Promise<IFileInformation> {
    const fileContent = await storageService.getFileContent(storageKey);

    return await this.getCSVInformation(fileContent, { headers: true });
  }
  private async getCSVInformation(fileContent: string, options?: ParserOptionsArgs): Promise<IFileInformation> {
    return new Promise((resolve, reject) => {
      const information: IFileInformation = {
        data: [],
        headings: [],
        totalRecords: 0,
      };

      parseString(fileContent, options)
        .on('error', reject)
        .on('headers', (headers) => information.headings.push(...headers))
        .on('data', (row) => information.data.push(row))
        .on('end', () => {
          information.totalRecords = information.data.length;
          resolve(information);
        });
    });
  }
}
