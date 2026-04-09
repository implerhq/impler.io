import { Injectable, ForbiddenException } from '@nestjs/common';
import { ColumnRepository, TemplateRepository } from '@impler/dal';
import { DEFAULT_KEYS_OBJ, ColumnTypesEnum } from '@impler/shared';
import { UpdateCustomization } from 'app/template/usecases';
import { AddColumnCommand } from '../../commands/add-column.command';
import { UniqueColumnException } from '@shared/exceptions/unique-column.exception';
import { SaveSampleFile } from '@shared/usecases/save-sample-file/save-sample-file.usecase';

@Injectable()
export class AddColumn {
  constructor(
    private saveSampleFile: SaveSampleFile,
    private columnRepository: ColumnRepository,
    private templateRepository: TemplateRepository,
    private updateCustomization: UpdateCustomization
  ) {}

  async execute(command: AddColumnCommand, _templateId: string, _projectId?: string) {
    // Verify template belongs to user's project
    if (_projectId) {
      const template = await this.templateRepository.findOne({ _id: _templateId, _projectId });
      if (!template) {
        throw new ForbiddenException('Template not found or does not belong to this project');
      }
    }
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
