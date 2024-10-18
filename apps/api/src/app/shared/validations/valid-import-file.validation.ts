// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import _whatever from 'multer';
import { SupportedFileMimeTypes } from '@impler/shared';
import { Injectable, PipeTransform } from '@nestjs/common';
import { FileNotValidError } from '../exceptions/file-not-valid.exception';

@Injectable()
export class ValidImportFile implements PipeTransform<Express.Multer.File> {
  transform(value: Express.Multer.File) {
    if (value && !SupportedFileMimeTypes.includes(value.mimetype)) {
      throw new FileNotValidError();
    }

    return value;
  }
}
