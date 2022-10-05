import { BaseRepository } from '../base-repository';
import { ColumnEntity } from './column.entity';
import { Column } from './column.schema';

export class ColumnRepository extends BaseRepository<ColumnEntity> {
  constructor() {
    super(Column, ColumnEntity);
  }
}
