import { Injectable } from '@nestjs/common';

import { CONSTANTS } from '@shared/constants';
import { AddColumnCommand } from 'app/column/commands/add-column.command';
import { ColumnRepository, CustomizationRepository } from '@impler/dal';
import { createRecordFormat, updateCombinedFormat } from '@impler/shared';
import { SaveSampleFile } from '@shared/usecases/save-sample-file/save-sample-file.usecase';

@Injectable()
export class UpdateTemplateColumns {
  constructor(
    private saveSampleFile: SaveSampleFile,
    private columnRepository: ColumnRepository,
    private customizationRepository: CustomizationRepository
  ) {}

  async execute(command: AddColumnCommand[], _templateId: string) {
    await this.columnRepository.deleteMany({ _templateId });
    await this.updateCustomizationData(command, _templateId);
    const columns = await this.columnRepository.createMany(command);
    await this.saveSampleFile.execute(columns, _templateId);

    return columns;
  }

  listRecordVariables(data: AddColumnCommand[]): string[] {
    return data.map((column) => column.key);
  }

  async updateCustomizationData(data: AddColumnCommand[], _templateId: string) {
    let customization = await this.customizationRepository.findOne({
      _templateId,
    });
    if (!customization) {
      customization = await this.customizationRepository.create({
        _templateId,
        chunkFormat: CONSTANTS.CHUNK_FORMAT,
        recordFormat: '{}',
        chunkVariables: CONSTANTS.CHUNK_VARIABLES,
      });
    }
    customization.recordVariables = this.listRecordVariables(data);

    if (!customization.isRecordFormatUpdated) {
      customization.recordFormat = createRecordFormat(customization.recordVariables);
    }
    if (!customization.isCombinedFormatUpdated) {
      customization.combinedFormat = updateCombinedFormat(CONSTANTS.COMBINED_FORMAT, customization.recordVariables);
    }

    await this.customizationRepository.update({ _templateId }, customization);
  }

  createCSVFileHeadingContent(data: AddColumnCommand[]): string {
    const headings = data.map((column) => column.key);

    return headings.join(',');
  }
}
