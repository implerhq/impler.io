import { Injectable } from '@nestjs/common';
import { ColumnRepository } from '@impler/dal';

@Injectable()
export class GetTemplateColumns {
  constructor(private columnRepository: ColumnRepository) {}

  async execute(_templateId: string) {
    return this.columnRepository.find(
      { _templateId },
      '_id name key type alternateKeys isRequired isUnique selectValues regex dateFormats defaultValue sequence'
    );
  }
}
