import { Injectable } from '@nestjs/common';

import { ColumnRepository, TemplateRepository } from '@impler/dal';
import { AddColumnCommand } from 'app/column/commands/add-column.command';
import { UniqueColumnException } from '@shared/exceptions/unique-column.exception';
import { SaveSampleFile } from '@shared/usecases/save-sample-file/save-sample-file.usecase';
import { UpdateCustomization } from '../update-customization/update-customization.usecase';
import { APIMessages } from '@shared/constants';

@Injectable()
export class UpdateTemplateColumns {
  constructor(
    private saveSampleFile: SaveSampleFile,
    private columnRepository: ColumnRepository,
    private templateRepository: TemplateRepository,
    private updateCustomization: UpdateCustomization
  ) {}

  async execute(command: AddColumnCommand[], _templateId: string) {
    const columnKeysSet = new Set(command.map((column) => column.key));
    if (columnKeysSet.size !== command.length) {
      throw new UniqueColumnException(APIMessages.COLUMN_KEY_TAKEN);
    }
    await this.columnRepository.deleteMany({ _templateId });
    command.forEach((column, index) => {
      column.sequence = index;
      column.dateFormats = column.dateFormats?.map((format) => format.toUpperCase()) || [];
    });
    const columns = await this.columnRepository.createMany(command);
    await this.saveSampleFile.execute(columns, _templateId);

    const template = await this.templateRepository.findById(_templateId, 'destination');
    await this.updateCustomization.createOrReset(_templateId, {
      recordVariables: this.listRecordVariables(command),
      destination: template.destination,
    });

    return columns;
  }

  listRecordVariables(data: AddColumnCommand[]): string[] {
    return data.map((column) => column.key);
  }
}
