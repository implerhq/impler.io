import { Injectable } from '@nestjs/common';
import { ColumnTypesEnum } from '@impler/shared';
import { ColumnEntity, TemplateRepository } from '@impler/dal';

@Injectable()
export class UpdateImageColumns {
  constructor(private templateRepository: TemplateRepository) {}

  async execute(columns: ColumnEntity[], _templateId: string) {
    const imageColumns = columns.reduce((acc, columnItem) => {
      if (columnItem.type === ColumnTypesEnum.IMAGE) acc.push(columnItem.key);

      return acc;
    }, [] as string[]);
    await this.templateRepository.update({ _id: _templateId }, { $set: { imageColumns } });
  }
}
