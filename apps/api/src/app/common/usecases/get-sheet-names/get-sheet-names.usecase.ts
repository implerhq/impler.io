import { Injectable } from '@nestjs/common';
import { FileMimeTypesEnum } from '@impler/shared';

import { ExcelFileService } from '@shared/services/file';
import { GetSheetNamesCommand } from './get-sheet-names.command';
import { FileParseException } from '@shared/exceptions/file-parse-issue.exception';

@Injectable()
export class GetSheetNames {
  async execute({ file }: GetSheetNamesCommand): Promise<string[]> {
    if (file.mimetype === FileMimeTypesEnum.EXCEL || file.mimetype === FileMimeTypesEnum.EXCELX) {
      try {
        const fileService = new ExcelFileService();

        return await fileService.getExcelSheets(file);
      } catch (error) {
        throw new FileParseException();
      }
    } else {
      throw new Error('Invalid file type');
    }
  }
}
