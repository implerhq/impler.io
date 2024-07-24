import { Injectable } from '@nestjs/common';
import { ColumnRepository } from '@impler/dal';
import { DEFAULT_KEYS_OBJ } from '@impler/shared';
import { AddColumnCommand } from '../../commands/add-column.command';
import { SaveSampleFile } from '@shared/usecases/save-sample-file/save-sample-file.usecase';
import { UpdateCustomization } from 'app/template/usecases';
import { UniqueColumnException } from '@shared/exceptions/unique-column.exception';

@Injectable()
export class AddColumn {
  constructor(
    private saveSampleFile: SaveSampleFile,
    private columnRepository: ColumnRepository,
    private updateCustomization: UpdateCustomization
  ) {}

  async execute(command: AddColumnCommand, _templateId: string) {
    const columns = await this.columnRepository.find({ _templateId });
    const sameKeyColumns = columns.filter((columnItem) => columnItem.key === command.key);
    if (sameKeyColumns.length > 0) {
      throw new UniqueColumnException();
    }
    const column = await this.columnRepository.create({
      defaultValue: DEFAULT_KEYS_OBJ.null,
      ...command,
      sequence: columns.length,
      dateFormats: command.dateFormats?.map((format) => format.toUpperCase()) || [],
    });
    const variables = columns.map((columnItem) => columnItem.key);
    variables.push(column.key);

    await this.updateCustomization.execute(_templateId, {
      recordVariables: variables,
      internal: true,
    });
    await this.saveSampleFile.execute([...columns, column], _templateId);

    return column;
  }
}
