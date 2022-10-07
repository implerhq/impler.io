import { parse } from 'json2csv';
import { StorageService } from '../storage/storage.service';

export abstract class FileService {
  // abstract convertToJson(data: any, fields: string[]): string;
  abstract convertFromJson(data: any, fields: string[]): string;
  abstract saveFile(storageService: StorageService, data: any, key: string): Promise<void>;
}

export class CSVFileService extends FileService {
  convertFromJson(data: any, fields: string[]): string {
    return parse(data, { fields, header: true });
  }
  async saveFile(storageService: StorageService, data: any, key: string, isPublic = false): Promise<void> {
    await storageService.uploadFile(key, data, 'application/csv', isPublic);
  }
}
