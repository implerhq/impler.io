import { Injectable } from '@nestjs/common';
import { FileMimeTypesEnum } from '@impler/shared';
import { ColumnRepository, TemplateRepository } from '@impler/dal';
import { UpdateColumnCommand } from '../../commands/update-column.command';
import { StorageService } from '@impler/shared/dist/services/storage';
import { FileNameService } from '@shared/file/name.service';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class UpdateColumn {
  constructor(
    private columnRepository: ColumnRepository,
    private storageService: StorageService,
    private fileNameService: FileNameService,
    private templateRepository: TemplateRepository
  ) {}

  async execute(command: UpdateColumnCommand, _id: string) {
    let column = await this.columnRepository.findOne({ _id });
    if (!column) {
      throw new DocumentNotFoundException('Column', _id);
    }

    column = await this.columnRepository.findOneAndUpdate({ _id }, command);
    const columns = await this.columnRepository.find({ _templateId: column._templateId });
    const columnKeys = columns.map((columnItem) => columnItem.key);
    await this.saveSampleFile(columnKeys.join(','), column._templateId);

    return column;
  }

  async saveSampleFile(csvContent: string, templateId: string) {
    const fileName = this.fileNameService.getSampleFileName(templateId);
    const sampleFileUrl = this.fileNameService.getSampleFileUrl(templateId);
    await this.storageService.uploadFile(fileName, csvContent, FileMimeTypesEnum.CSV);
    await this.templateRepository.update({ _id: templateId }, { sampleFileUrl });
  }
}
