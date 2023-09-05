import { Injectable } from '@nestjs/common';
import { ColumnRepository } from '@impler/dal';
import { ColumnTypesEnum } from '@impler/shared';
import { ExcelFileService } from '@shared/services/file';
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
    const columnKeys: IExcelFileHeading[] = columns.map((columnItem) => ({
      key: columnItem.key,
      type: columnItem.type as ColumnTypesEnum,
      selectValues: columnItem.selectValues,
      isRequired: columnItem.isRequired,
    }));

    return await this.excelFileService.getExcelFileForHeadings(columnKeys, data.data);
  }
}
