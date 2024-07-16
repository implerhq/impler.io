import { Injectable } from '@nestjs/common';
import { ColumnRepository } from '@impler/dal';

@Injectable()
export class GetImportMappingInfo {
  constructor(private readonly columnRepository: ColumnRepository) {}

  async execute(templateId: string): Promise<any> {
    const column = await this.columnRepository.find({ _templateId: templateId });

    if (!column) {
      throw new Error('Column not found');
    }

    return column;
  }
}
