import { Injectable } from '@nestjs/common';
import { ColumnRepository } from '@impler/dal';

@Injectable()
export class GetTemplateColumns {
  constructor(private columnRepository: ColumnRepository) {}

  async execute(_templateId: string) {
    return this.columnRepository.find(
      { _templateId },
      '_id name key alternateKeys isRequired isUnique selectValues sequence'
    );
  }
}
