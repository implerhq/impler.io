import { Injectable } from '@nestjs/common';
import { ColumnRepository } from '@impler/dal';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class DeleteColumn {
  constructor(private columnRepository: ColumnRepository) {}

  async execute(_id: string) {
    const column = await this.columnRepository.findById(_id);
    if (!column) {
      throw new DocumentNotFoundException('Column', _id);
    }
    await this.columnRepository.delete({ _id });

    return column;
  }
}
