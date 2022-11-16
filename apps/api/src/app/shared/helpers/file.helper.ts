import { FileMimeTypesEnum } from '@impler/shared';
import { APIMessages } from '../constants';
import { FileService, CSVFileService, ExcelFileService } from '../file/file.service';

export const getFileService = (mimeType: string): FileService => {
  if (mimeType === FileMimeTypesEnum.CSV) {
    return new CSVFileService();
  } else if (mimeType === FileMimeTypesEnum.EXCEL || mimeType === FileMimeTypesEnum.EXCELX) {
    return new ExcelFileService();
  }

  throw new Error(APIMessages.FILE_TYPE_NOT_VALID);
};
