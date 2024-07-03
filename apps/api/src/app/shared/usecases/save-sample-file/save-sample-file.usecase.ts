import { Injectable } from '@nestjs/common';
import { ColumnTypesEnum, FileNameService, FileMimeTypesEnum } from '@impler/shared';
import { StorageService } from '@impler/shared/dist/services/storage';
import { ColumnEntity, TemplateRepository } from '@impler/dal';
import { IExcelFileHeading } from '@shared/types/file.types';
import { ExcelFileService } from '@shared/services/file';

@Injectable()
export class SaveSampleFile {
  constructor(
    private excelFileService: ExcelFileService,
    private storageService: StorageService,
    private fileNameService: FileNameService,
    private templateRepository: TemplateRepository
  ) {}

  async execute(columns: ColumnEntity[], templateId: string) {
    const columnKeys: IExcelFileHeading[] = columns
      .map((columnItem) => ({
        key: columnItem.key,
        type: columnItem.type as ColumnTypesEnum,
        selectValues: columnItem.selectValues,
        isFrozen: columnItem.isFrozen,
        isRequired: columnItem.isRequired,
        dateFormats: columnItem.dateFormats,
        allowMultiSelect: columnItem.allowMultiSelect,
      }))
      .sort((a, b) => (a.isFrozen === b.isFrozen ? 0 : a.isFrozen ? -1 : 1));

    const hasMultiSelect = columns.some(
      (columnItem) => columnItem.type === ColumnTypesEnum.SELECT && columnItem.allowMultiSelect
    );
    const fileName = this.fileNameService.getSampleFileName(templateId, hasMultiSelect);
    const sampleFileUrl = this.fileNameService.getSampleFileUrl(templateId, hasMultiSelect);
    const sampleExcelFile = await this.excelFileService.getExcelFileForHeadings(columnKeys);
    await this.storageService.uploadFile(fileName, sampleExcelFile, FileMimeTypesEnum.EXCELM);
    await this.templateRepository.update({ _id: templateId }, { sampleFileUrl });
  }
}
