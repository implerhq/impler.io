import { Injectable } from '@nestjs/common';
import { ColumnTypesEnum, FileMimeTypesEnum } from '@impler/shared';
import { StorageService } from '@impler/shared/dist/services/storage';
import { ColumnEntity, TemplateRepository } from '@impler/dal';
import { IExcelFileHeading } from '@shared/types/file.types';
import { ExcelFileService, FileNameService } from '@shared/services/file';

@Injectable()
export class SaveSampleFile {
  constructor(
    private excelFileService: ExcelFileService,
    private storageService: StorageService,
    private fileNameService: FileNameService,
    private templateRepository: TemplateRepository
  ) {}

  async execute(columns: ColumnEntity[], templateId: string) {
    const columnKeys: IExcelFileHeading[] = columns.map((columnItem) => ({
      key: columnItem.key,
      type: columnItem.type as ColumnTypesEnum,
      selectValues: columnItem.selectValues,
      isRequired: columnItem.isRequired,
    }));
    const fileName = this.fileNameService.getSampleFileName(templateId);
    const sampleFileUrl = this.fileNameService.getSampleFileUrl(templateId);
    const sampleExcelFile = await this.excelFileService.getExcelFileForHeadings(columnKeys);
    await this.storageService.uploadFile(fileName, sampleExcelFile, FileMimeTypesEnum.EXCEL);
    await this.templateRepository.update({ _id: templateId }, { sampleFileUrl });
  }
}
