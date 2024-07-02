import { Injectable } from '@nestjs/common';
import { ColumnTypesEnum } from '@impler/shared';
import { SaveSampleFile } from '@shared/usecases';
import { ColumnRepository, TemplateRepository } from '@impler/dal';
import { UpdateCustomization } from 'app/template/usecases';
import { AddColumnCommand } from '../../commands/add-column.command';

@Injectable()
export class AddColumn {
  constructor(
    private saveSampleFile: SaveSampleFile,
    private columnRepository: ColumnRepository,
    private templateRepository: TemplateRepository,
    private updateCustomization: UpdateCustomization
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
    if (command.type === ColumnTypesEnum.IMAGE) {
      await this.templateRepository.update({ _id: _templateId }, { $push: { imageColumns: column.key } });
    }

    await this.updateCustomization.execute(_templateId, {
      recordVariables: variables,
      internal: true,
    });
    await this.saveSampleFile.execute([...columns, column], _templateId);

    return column;
  }
}
