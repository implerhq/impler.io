import { Injectable } from '@nestjs/common';
import { ColumnRepository } from '@impler/dal';
import { UpdateCustomization } from 'app/template/usecases';
import { UpdateColumnCommand } from '../../commands/update-column.command';
import { UniqueColumnException } from '@shared/exceptions/unique-column.exception';
import { SaveSampleFile } from '@shared/usecases/save-sample-file/save-sample-file.usecase';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class UpdateColumn {
  constructor(
    private saveSampleFile: SaveSampleFile,
    private columnRepository: ColumnRepository,
    private updateCustomization: UpdateCustomization
  ) {}

  async execute(command: UpdateColumnCommand, _id: string) {
    let column = await this.columnRepository.findOne({ _id });
    if (!column) {
      throw new DocumentNotFoundException('Column', _id);
    }

    const columns = await this.columnRepository.find({ _templateId: column._templateId });
    const sameKeyColumns = columns
      .map((columnItem) => (columnItem._id === _id ? { ...command, ...columnItem } : columnItem))
      .filter((columnItem) => columnItem.key === command.key);
    if (sameKeyColumns.length > 1) {
      throw new UniqueColumnException();
    }

    command.dateFormats = command.dateFormats?.map((format) => format.toUpperCase()) || [];
    const isKeyUpdated = command.key !== column.key || command.allowMultiSelect !== column.allowMultiSelect;
    const isTypeUpdated = command.type !== column.type;
    const isFieldConditionUpdated =
      JSON.stringify(column.selectValues) !== JSON.stringify(command.selectValues) ||
      JSON.stringify(column.dateFormats) !== JSON.stringify(command.dateFormats) ||
      column.isRequired !== command.isRequired;

    column = await this.columnRepository.findOneAndUpdate({ _id }, command);

    if (isKeyUpdated || isTypeUpdated || isFieldConditionUpdated) {
      await this.saveSampleFile.execute(columns, column._templateId);
    }

    if (isKeyUpdated) {
      const variables = columns.map((columnItem) => columnItem.key);
      await this.updateCustomization.execute(column._templateId, {
        recordVariables: variables,
        internal: true,
      });
    }

    return column;
  }
}
