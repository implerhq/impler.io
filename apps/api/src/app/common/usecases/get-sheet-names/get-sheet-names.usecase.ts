import { Injectable } from '@nestjs/common';
import { FileMimeTypesEnum } from '@impler/shared';

import { CONSTANTS } from '@shared/constants';
import { ExcelFileService } from '@shared/services/file';
import { GetSheetNamesCommand } from './get-sheet-names.command';
import { FileParseException } from '@shared/exceptions/file-parse-issue.exception';

@Injectable()
export class GetSheetNames {
  async execute({ file }: GetSheetNamesCommand): Promise<string[]> {
    if (file.mimetype === FileMimeTypesEnum.EXCEL || file.mimetype === FileMimeTypesEnum.EXCELX) {
      try {
        const fileService = new ExcelFileService();
        const sheetNames = await fileService.getExcelSheets(file);

        return sheetNames.filter((sheetName) => !sheetName.startsWith(CONSTANTS.EXCEL_DATA_SHEET_STARTER));
      } catch (error) {
        throw new FileParseException();
      }
    } else {
      throw new Error('Invalid file type');
    }
  }
}
