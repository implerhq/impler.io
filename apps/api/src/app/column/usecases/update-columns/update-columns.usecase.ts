import { Injectable } from '@nestjs/common';
import { ColumnRepository } from '@impler/dal';
import { UpdateColumnCommand } from './update-columns.command';

@Injectable()
export class UpdateColumns {
  constructor(private columnRepository: ColumnRepository) {}

  async execute(command: UpdateColumnCommand[], templateId: string) {
    await this.columnRepository.delete({ templateId });

    return this.columnRepository.createMany(command);
  }
}
