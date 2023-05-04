import { Injectable } from '@nestjs/common';
import { createRecordFormat } from '@shared/helpers/common.helper';
import { ColumnRepository, ColumnEntity, CustomizationRepository } from '@impler/dal';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';
import { CONSTANTS } from '@shared/constants';

@Injectable()
export class DeleteColumn {
  constructor(private columnRepository: ColumnRepository, private customizationRepository: CustomizationRepository) {}

  async execute(_id: string) {
    const column = await this.columnRepository.findById(_id);
    if (!column) {
      throw new DocumentNotFoundException('Column', _id);
    }
    await this.columnRepository.delete({ _id });
    await this.updateCustomization(column._templateId, column);

    return column;
  }

  async updateCustomization(_templateId: string, column: ColumnEntity) {
    const customization = await this.customizationRepository.findOne({
      _templateId,
    });
    customization.recordVariables = customization.recordVariables.filter(
      (variable) => variable !== CONSTANTS.RECORD_VARIABLE_PREFIX + column.key
    );

    if (!customization.isRecordFormatUpdated) {
      customization.recordFormat = createRecordFormat(customization.recordVariables);
    }
    await this.customizationRepository.update({ _templateId }, customization);
  }
}
