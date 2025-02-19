import { ColumnTypesEnum, ITemplateSchema } from '@impler/shared';
import { Injectable, BadRequestException } from '@nestjs/common';
import { APIMessages, MAX_FILE_SIZE, TYPE_CHECK_SAMPLE } from '@shared/constants';
import * as XLSX from 'xlsx';

@Injectable()
export class GetImportFileSchema {
  async exec({ file }: { templateId?: string; file?: Express.Multer.File }): Promise<ITemplateSchema[]> {
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(APIMessages.ONBOARD_TEMPLATE_FILE_SIZE_EXCEED);
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });

    if (!workbook.SheetNames.length) {
      throw new BadRequestException(APIMessages.ONBOARD_TEMPLATE_SHEET_NOT_FOUND);
    }

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    if (!jsonData || jsonData.length === 0) {
      throw new BadRequestException(APIMessages.ONBOARD_TEMPLATE_FILE_EMPTY);
    }

    const hasEmptyRecords = jsonData.some((record) => Object.keys(record).length === 0);
    if (hasEmptyRecords) {
      throw new BadRequestException(APIMessages.ONBOARD_TEMPLATE_FILE_EMPTY_RECORDS);
    }

    return this.createColumnEntities(jsonData);
  }

  private createColumnEntities(data: Record<string, any>[]): ITemplateSchema[] {
    const firstRow = data[0];
    const columns: ITemplateSchema[] = [];
    const sampleData = data.slice(0, TYPE_CHECK_SAMPLE);

    Object.keys(firstRow).forEach((key) => {
      const values = sampleData.map((row) => row[key]);
      const columnType = this.inferColumnType(values);

      columns.push({
        name: key,
        key: key,
        type: columnType.type,
      });
    });

    return columns;
  }

  private inferColumnType(values: any[]): { type: ColumnTypesEnum; selectValues?: any[] } {
    const validValues = values.filter((value) => value != null && value !== '');
    if (validValues.length === 0) return { type: ColumnTypesEnum.STRING };

    for (const value of validValues.slice(0, TYPE_CHECK_SAMPLE)) {
      if (!isNaN(value) && typeof value !== 'boolean') {
        if (value.toString().includes('.')) {
          return { type: ColumnTypesEnum.DOUBLE };
        }

        return { type: ColumnTypesEnum.NUMBER };
      }

      if (Array.isArray(value)) {
        return { type: ColumnTypesEnum.ANY };
      }

      if (typeof value === 'string' && value.includes('@')) {
        return { type: ColumnTypesEnum.EMAIL };
      }

      const dateValue = new Date(value);
      if (!isNaN(dateValue.getTime())) {
        return { type: ColumnTypesEnum.DATE };
      }
    }

    const uniqueValues = new Set(validValues);
    if (uniqueValues.size <= 5 && uniqueValues.size < values.length * 0.3) {
      return { type: ColumnTypesEnum.SELECT, selectValues: Array.from(uniqueValues) };
    }

    return { type: ColumnTypesEnum.STRING };
  }
}
