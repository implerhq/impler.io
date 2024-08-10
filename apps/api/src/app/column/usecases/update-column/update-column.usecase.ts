import { Injectable } from '@nestjs/common';
import { ColumnRepository } from '@impler/dal';
import { UpdateImageColumns } from '@shared/usecases';
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
    private updateImageTemplates: UpdateImageColumns,
    private updateCustomization: UpdateCustomization
  ) {}

  async execute(command: UpdateColumnCommand, _id: string) {
    let column = await this.columnRepository.findOne({ _id });
    if (!column) {
      throw new DocumentNotFoundException('Column', _id);
    }

    const columns = await this.columnRepository.find({ _templateId: column._templateId });
    const updatedColumns = columns.map((columnItem) =>
      columnItem._id === _id ? { ...command, _templateId: columnItem._templateId } : columnItem
    );
    const sameKeyColumns = updatedColumns.filter((columnItem) => columnItem.key === command.key);
    if (sameKeyColumns.length > 1) {
      throw new UniqueColumnException();
    }

    command.dateFormats = command.dateFormats?.map((format) => format.toUpperCase()) || [];
    const isKeyUpdated = command.key !== column.key || command.allowMultiSelect !== column.allowMultiSelect;
    const isTypeUpdated = command.type !== column.type;
    const isFieldConditionUpdated =
      JSON.stringify(column.selectValues) !== JSON.stringify(command.selectValues) ||
      JSON.stringify(column.dateFormats) !== JSON.stringify(command.dateFormats) ||
      column.isRequired !== command.isRequired ||
      column.delimiter !== command.delimiter;

    column = await this.columnRepository.findOneAndUpdate({ _id }, command);
    await this.updateImageTemplates.execute(updatedColumns, column._templateId);

    if (isKeyUpdated || isTypeUpdated || isFieldConditionUpdated) {
      await this.saveSampleFile.execute(updatedColumns, column._templateId);
    }

    if (isKeyUpdated) {
      const variables = updatedColumns.map((columnItem) => columnItem.key);
      await this.updateCustomization.execute(column._templateId, {
        recordVariables: variables,
        internal: true,
      });
    }

    return column;
  }
}
