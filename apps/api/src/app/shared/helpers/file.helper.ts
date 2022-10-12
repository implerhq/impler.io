import { SupportedFileMimeTypesEnum } from '@impler/shared';
import { APIMessages } from '../constants';
import { FileService, CSVFileService, ExcelFileService } from '../file/file.service';

export const getFileService = (mimeType: string): FileService => {
  if (mimeType === SupportedFileMimeTypesEnum.CSV) {
    return new CSVFileService();
  } else if (mimeType === SupportedFileMimeTypesEnum.EXCEL || mimeType === SupportedFileMimeTypesEnum.EXCELX) {
    return new ExcelFileService();
  }

  throw new Error(APIMessages.FILE_TYPE_NOT_VALID);
};
