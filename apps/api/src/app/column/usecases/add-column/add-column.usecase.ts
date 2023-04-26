import { Injectable } from '@nestjs/common';
import { FileMimeTypesEnum } from '@impler/shared';
import { ColumnRepository, TemplateRepository } from '@impler/dal';
import { AddColumnCommand } from '../../commands/add-column.command';
import { StorageService } from '@impler/shared/dist/services/storage';
import { FileNameService } from '@shared/file/name.service';

@Injectable()
export class AddColumn {
  constructor(
    private columnRepository: ColumnRepository,
    private storageService: StorageService,
    private fileNameService: FileNameService,
    private templateRepository: TemplateRepository
  ) {}

  async execute(command: AddColumnCommand, _templateId: string) {
    const columns = await this.columnRepository.find({ _templateId });
    const column = await this.columnRepository.create({
      ...command,
      sequence: columns.length,
    });
    const columnKeys = columns.map((columnItem) => columnItem.key);
    columnKeys.push(column.key);

    await this.saveSampleFile(columnKeys.join(','), _templateId);

    return column;
  }

  async saveSampleFile(csvContent: string, templateId: string) {
    const fileName = this.fileNameService.getSampleFileName(templateId);
    const sampleFileUrl = this.fileNameService.getSampleFileUrl(templateId);
    await this.storageService.uploadFile(fileName, csvContent, FileMimeTypesEnum.CSV);
    await this.templateRepository.update({ _id: templateId }, { sampleFileUrl });
  }
}
