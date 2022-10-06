import { Injectable } from '@nestjs/common';
import { ColumnRepository } from '@impler/dal';

@Injectable()
export class GetColumns {
  constructor(private columnRepository: ColumnRepository) {}

  async execute(templateId: string) {
    return this.columnRepository.find({ templateId });
  }
}
