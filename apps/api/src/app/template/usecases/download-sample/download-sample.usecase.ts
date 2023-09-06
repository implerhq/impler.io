import { Injectable } from '@nestjs/common';
import { ColumnEntity, ColumnRepository } from '@impler/dal';
import { ColumnTypesEnum, ISchemaItem } from '@impler/shared';

import { ExcelFileService } from '@shared/services/file';
import { mergeObjects } from '@shared/helpers/common.helper';
import { IExcelFileHeading } from '@shared/types/file.types';
import { DownloadSampleCommand } from './download-sample.command';

@Injectable()
export class DownloadSample {
  constructor(private columnsRepository: ColumnRepository, private excelFileService: ExcelFileService) {}

  async execute(_templateId: string, data: DownloadSampleCommand): Promise<Buffer> {
    const columns = await this.columnsRepository.find(
      {
        _templateId,
      },
      'key type selectValues isRequired'
    );

    let parsedSchema: ISchemaItem[], columnKeys: IExcelFileHeading[];
    try {
      if (data.schema) parsedSchema = JSON.parse(data.schema);
    } catch (error) {}

    if (Array.isArray(parsedSchema) && parsedSchema.length > 0) {
      // if custom schema is provided, merge it with default schema
      const formattedColumns: Record<string, ColumnEntity> = columns.reduce((acc, column) => {
        acc[column.key] = { ...column };

        return acc;
      }, {});
      parsedSchema.forEach((schemaItem) => {
        if (formattedColumns.hasOwnProperty(schemaItem.key)) {
          mergeObjects(formattedColumns[schemaItem.key], schemaItem, ['isRequired', 'selectValues', 'type']);
        }
      });
      columnKeys = Object.values(formattedColumns).map((columnItem) => ({
        key: columnItem.key,
        type: columnItem.type as ColumnTypesEnum,
        selectValues: columnItem.selectValues,
        isRequired: columnItem.isRequired,
      }));
    } else {
      // else create structure from existing defualt schema
      columnKeys = columns.map((columnItem) => ({
        key: columnItem.key,
        type: columnItem.type as ColumnTypesEnum,
        selectValues: columnItem.selectValues,
        isRequired: columnItem.isRequired,
      }));
    }

    return await this.excelFileService.getExcelFileForHeadings(columnKeys, data.data);
  }
}
