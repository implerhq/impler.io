// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import _whatever from 'multer';
import { SupportedFileMimeTypesEnum } from '@impler/shared';
import { Injectable, PipeTransform } from '@nestjs/common';
import { FileNotValidError } from '../errors/file-not-valid.error';

@Injectable()
export class ValidImportFile implements PipeTransform<Express.Multer.File> {
  transform(value: Express.Multer.File) {
    if (!(Object.values(SupportedFileMimeTypesEnum) as string[]).includes(value.mimetype)) {
      throw new FileNotValidError();
    }

    return value;
  }
}
