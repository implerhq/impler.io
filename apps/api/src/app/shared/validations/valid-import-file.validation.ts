// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import _whatever from 'multer';
import { SupportedFileMimeTypes } from '@impler/shared';
import { Injectable, PipeTransform, PayloadTooLargeException } from '@nestjs/common';
import { FileNotValidError } from '../exceptions/file-not-valid.exception';
import { MAX_FILE_SIZE } from '../constants';

@Injectable()
export class ValidImportFile implements PipeTransform<Express.Multer.File> {
  transform(value: Express.Multer.File) {
    if (value && !SupportedFileMimeTypes.includes(value.mimetype)) {
      throw new FileNotValidError();
    }

    if (value && value.size > MAX_FILE_SIZE) {
      throw new PayloadTooLargeException(`File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)} MB`);
    }

    return value;
  }
}
