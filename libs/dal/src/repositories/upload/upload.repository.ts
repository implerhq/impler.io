import { BaseRepository } from '../base-repository';
import { UploadEntity } from './upload.entity';
import { Upload } from './upload.schema';

export class UploadRepository extends BaseRepository<UploadEntity> {
  constructor() {
    super(Upload, UploadEntity);
  }
}
