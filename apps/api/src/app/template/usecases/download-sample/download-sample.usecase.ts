import * as JSZip from 'jszip';
import { Injectable } from '@nestjs/common';
import { ColumnRepository } from '@impler/dal';
import { ColumnTypesEnum, FileMimeTypesEnum, FileNameService, ISchemaItem } from '@impler/shared';

import { ExcelFileService } from '@shared/services/file';
import { IExcelFileHeading } from '@shared/types/file.types';
import { getAssetMimeType } from '@shared/helpers/common.helper';
import { DownloadSampleDataCommand } from './download-sample.command';
import { StorageService } from '@impler/shared/dist/services/storage';

@Injectable()
export class DownloadSample {
  constructor(
    private storageService: StorageService,
    private fileNameService: FileNameService,
    private excelFileService: ExcelFileService,
    private columnsRepository: ColumnRepository
  ) {}

  async execute({
    data,
    images,
    _templateId,
  }: {
    _templateId: string;
    images?: Express.Multer.File;
    data: DownloadSampleDataCommand;
  }): Promise<{
    file: Buffer;
    type: string;
    ext: string;
  }> {
    const isImageTemplate = images && data.importId && data.imageSchema;
    const imageSchema = isImageTemplate ? JSON.parse(data.imageSchema) : undefined;
    const columns = await this.columnsRepository.find(
      {
        _templateId,
      },
      'key type selectValues isRequired allowMultiSelect'
    );

    let parsedSchema: ISchemaItem[], columnKeys: IExcelFileHeading[];
    try {
      if (data.schema) parsedSchema = JSON.parse(data.schema);
    } catch (error) {}

    if (Array.isArray(parsedSchema) && parsedSchema.length > 0) {
      columnKeys = parsedSchema.map((columnItem) => ({
        key: columnItem.key,
        type:
          columnItem.type === ColumnTypesEnum.IMAGE
            ? ColumnTypesEnum.SELECT
            : (columnItem.type as ColumnTypesEnum) || ColumnTypesEnum.STRING,
        selectValues: imageSchema?.[columnItem.key] || columnItem.selectValues || [],
        isRequired: columnItem.isRequired,
        allowMultiSelect: columnItem.allowMultiSelect,
      }));
    } else {
      // else create structure from existing defualt schema
      columnKeys = columns.map((columnItem) => ({
        key: columnItem.key,
        type: columnItem.type === ColumnTypesEnum.IMAGE ? ColumnTypesEnum.SELECT : (columnItem.type as ColumnTypesEnum),
        selectValues: imageSchema?.[columnItem.key] || columnItem.selectValues || [],
        isRequired: columnItem.isRequired,
        allowMultiSelect: columnItem.allowMultiSelect,
      }));
    }
    const hasMultiSelect = columnKeys.some(
      (columnItem) => columnItem.type === ColumnTypesEnum.SELECT && columnItem.allowMultiSelect
    );
    const buffer = await this.excelFileService.getExcelFileForHeadings(columnKeys, data.data);
    if (images && data.importId) {
      const zip = await JSZip.loadAsync(images.buffer);
      await Promise.all(
        Object.keys(zip.files).map(async (filename) => {
          const file = zip.files[filename];
          const fileData = await file.async('base64');
          const storageFilename = this.fileNameService.getAssetFilePath(data.importId, filename);
          await this.storageService.uploadFile(storageFilename, fileData, getAssetMimeType(filename));
        })
      );
    }

    return {
      file: buffer,
      ext: hasMultiSelect ? 'xlsm' : 'xlsx',
      type: hasMultiSelect ? FileMimeTypesEnum.EXCELM : FileMimeTypesEnum.EXCELX,
    };
  }
}
