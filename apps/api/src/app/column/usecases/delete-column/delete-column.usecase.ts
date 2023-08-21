import { Injectable } from '@nestjs/common';
import { createRecordFormat, updateCombinedFormat } from '@impler/shared';
import { ColumnRepository, ColumnEntity, CustomizationRepository } from '@impler/dal';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';
import { SaveSampleFile } from '@shared/usecases/save-sample-file/save-sample-file.usecase';

@Injectable()
export class DeleteColumn {
  constructor(
    private columnRepository: ColumnRepository,
    private customizationRepository: CustomizationRepository,
    private saveSampleFile: SaveSampleFile
  ) {}

  async execute(_id: string) {
    const column = await this.columnRepository.findById(_id);
    if (!column) {
      throw new DocumentNotFoundException('Column', _id);
    }
    await this.columnRepository.delete({ _id });
    await this.updateCustomization(column._templateId, column);

    const columns = await this.columnRepository.find({ _templateId: column._templateId });
    await this.saveSampleFile.execute(columns, column._templateId);

    return column;
  }

  async updateCustomization(_templateId: string, column: ColumnEntity) {
    const customization = await this.customizationRepository.findOne({
      _templateId,
    });
    customization.recordVariables = customization.recordVariables.filter((variable) => variable !== column.key);

    if (!customization.isRecordFormatUpdated) {
      customization.recordFormat = createRecordFormat(customization.recordVariables);
    }
    if (!customization.isCombinedFormatUpdated) {
      customization.combinedFormat = updateCombinedFormat(customization.combinedFormat, customization.recordVariables);
    }
    await this.customizationRepository.update({ _templateId }, customization);
  }
}
