import { Injectable } from '@nestjs/common';
import { ColumnRepository } from '@impler/dal';

@Injectable()
export class GetColumns {
  constructor(private columnRepository: ColumnRepository) {}

  async execute(_templateId: string) {
    return this.columnRepository.find({ _templateId });
  }
}
