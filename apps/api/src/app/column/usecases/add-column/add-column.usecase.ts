import { Injectable } from '@nestjs/common';
import { createRecordFormat, updateCombinedFormat } from '@impler/shared';
import { ColumnRepository, CustomizationRepository, CustomizationEntity } from '@impler/dal';
import { AddColumnCommand } from '../../commands/add-column.command';
import { SaveSampleFile } from '@shared/usecases/save-sample-file/save-sample-file.usecase';

@Injectable()
export class AddColumn {
  constructor(
    private saveSampleFile: SaveSampleFile,
    private columnRepository: ColumnRepository,
    private customizationRepository: CustomizationRepository
  ) {}

  async execute(command: AddColumnCommand, _templateId: string) {
    const columns = await this.columnRepository.find({ _templateId });
    const column = await this.columnRepository.create({
      ...command,
      sequence: columns.length,
      dateFormats: command.dateFormats?.map((format) => format.toUpperCase()) || [],
    });
    const variables = columns.map((columnItem) => columnItem.key);
    variables.push(column.key);

    await this.updateCustomization(_templateId, variables);
    await this.saveSampleFile.execute([...columns, column], _templateId);

    return column;
  }

  async updateCustomization(_templateId: string, variables: string[]) {
    const customization = await this.customizationRepository.findOne({
      _templateId,
    });
    const updateData: Partial<CustomizationEntity> = {
      recordVariables: variables,
    };
    if (!customization.isRecordFormatUpdated) {
      updateData.recordFormat = createRecordFormat(variables);
    }
    if (!customization.isCombinedFormatUpdated) {
      updateData.combinedFormat = updateCombinedFormat(customization.combinedFormat, variables);
    }
    await this.customizationRepository.update({ _templateId }, updateData);
  }
}
