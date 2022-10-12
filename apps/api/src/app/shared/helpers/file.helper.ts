import { SupportedFileMimeTypesEnum } from '@impler/shared';
import { APIMessages } from '../constants';
import { FileService, CSVFileService } from '../file/file.service';

export const getFileService = (mimeType: string): FileService => {
  if (mimeType === SupportedFileMimeTypesEnum.CSV) {
    return new CSVFileService();
  }

  throw new Error(APIMessages.FILE_TYPE_NOT_VALID);
};
