import { Injectable } from '@nestjs/common';
import { FileRepository, MappingRepository } from '@impler/dal';
import { ExcelFileService } from '@shared/file/file.service';
import { StorageService } from '@impler/shared/dist/services/storage';
import { Defaults, FileEncodingsEnum, FileMimeTypesEnum } from '@impler/shared';

@Injectable()
export class ReanameFileHeadings {
  constructor(
    private fileRepository: FileRepository,
    private mappingRepository: MappingRepository,
    private excelFileService: ExcelFileService,
    private storageService: StorageService
  ) {}

  async execute(_uploadId: string, _validDataFileId: string, _invalidDataFileId?: string) {
    const mappingInfo = await this.mappingRepository.getMappingWithColumnInfo(_uploadId);
    const headings = mappingInfo.reduce((obj, mapping) => {
      obj[mapping.columnHeading] = mapping.column.key;

      return obj;
    }, {});
    if (_validDataFileId) await this.updateFileHeadings(_validDataFileId, headings);
    if (_invalidDataFileId) await this.updateFileHeadings(_invalidDataFileId, headings);
  }

  async updateFileHeadings(fileId: string, headings: Record<string, string>) {
    try {
      const file = await this.fileRepository.findById(fileId, 'path');
      let fileContent: any = await this.storageService.getFileContent(file.path, FileEncodingsEnum.JSON);
      fileContent = JSON.parse(fileContent);
      const headingsArr = this.getHeadings(fileContent[Defaults.ZERO], headings);
      const updatedFileJSON = this.excelFileService.renameJSONHeaders(fileContent, headingsArr);
      await this.storageService.uploadFile(file.path, JSON.stringify(updatedFileJSON), FileMimeTypesEnum.JSON);
    } catch (error) {
      throw error;
    }
  }

  getHeadings(obj: Record<string, unknown>, headings: Record<string, string>): string[] {
    if (typeof obj === 'object' && !Array.isArray(obj))
      return Object.keys(obj).reduce((arr, key) => {
        if (headings[key]) arr.push(headings[key]);
        else arr.push(key);

        return arr;
      }, []);
    else return [];
  }
}
