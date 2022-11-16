import { BaseRepository } from '../base-repository';
import { FileEntity } from './file.entity';
import { File } from './file.schema';

export class FileRepository extends BaseRepository<FileEntity> {
  constructor() {
    super(File, FileEntity);
  }
}
