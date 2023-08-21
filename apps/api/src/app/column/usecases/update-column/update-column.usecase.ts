import { Injectable } from '@nestjs/common';
import { createRecordFormat, updateCombinedFormat } from '@impler/shared';
import { UpdateColumnCommand } from '../../commands/update-column.command';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';
import { ColumnRepository, CustomizationRepository } from '@impler/dal';
import { SaveSampleFile } from '@shared/usecases/save-sample-file/save-sample-file.usecase';

@Injectable()
export class UpdateColumn {
  constructor(
    private saveSampleFile: SaveSampleFile,
    private columnRepository: ColumnRepository,
    private customizationRepository: CustomizationRepository
  ) {}

  async execute(command: UpdateColumnCommand, _id: string) {
    let column = await this.columnRepository.findOne({ _id });
    if (!column) {
      throw new DocumentNotFoundException('Column', _id);
    }

    const isKeyUpdated = command.key !== column.key;
    const isTypeUpdated = command.type !== column.type;
    const isFieldConditionUpdated =
      JSON.stringify(column.selectValues) !== JSON.stringify(command.selectValues) ||
      column.isRequired !== command.isRequired;

    column = await this.columnRepository.findOneAndUpdate({ _id }, command);
    const columns = await this.columnRepository.find({ _templateId: column._templateId });

    if (isKeyUpdated || isTypeUpdated || isFieldConditionUpdated) {
      await this.saveSampleFile.execute(columns, column._templateId);
    }

    if (isKeyUpdated) {
      const variables = columns.map((columnItem) => columnItem.key);
      await this.updateCustomization(column._templateId, variables);
    }

    return column;
  }

  async updateCustomization(_templateId: string, variables: string[]) {
    const customization = await this.customizationRepository.findOne({
      _templateId,
    });
    customization.recordVariables = variables;
    if (!customization.isRecordFormatUpdated) {
      customization.recordFormat = createRecordFormat(variables);
    }
    if (!customization.isCombinedFormatUpdated) {
      customization.combinedFormat = updateCombinedFormat(customization.combinedFormat, variables);
    }
    await this.customizationRepository.update({ _templateId }, customization);
  }
}
