import { Injectable } from '@nestjs/common';
import { ColumnRepository } from '@impler/dal';

@Injectable()
export class GetTemplateColumns {
  constructor(private columnRepository: ColumnRepository) {}

  async execute(_templateId: string) {
    return this.columnRepository.find(
      { _templateId },
      // eslint-disable-next-line max-len
      '_id name key description type alternateKeys isRequired isUnique isFrozen selectValues regex dateFormats defaultValue sequence allowMultiSelect delimiter validators',
      {
        sort: {
          isFrozen: -1,
          sequence: 1,
        },
      }
    );
  }
}
