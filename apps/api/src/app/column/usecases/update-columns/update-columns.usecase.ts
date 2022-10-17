import { Injectable } from '@nestjs/common';
import { SupportedFileMimeTypesEnum } from '@impler/shared';
import { ColumnRepository, TemplateRepository } from '@impler/dal';
import { UpdateColumnCommand } from './update-columns.command';
import { StorageService } from '../../../shared/storage/storage.service';
import { FileNameService } from '../../../shared/file/name.service';

@Injectable()
export class UpdateColumns {
  constructor(
    private columnRepository: ColumnRepository,
    private storageService: StorageService,
    private fileNameService: FileNameService,
    private templateRepository: TemplateRepository
  ) {}

  async execute(command: UpdateColumnCommand[], _templateId: string) {
    await this.columnRepository.deleteMany({ _templateId });
    this.saveSampleFile(command, _templateId);

    return this.columnRepository.createMany(command);
  }

  async saveSampleFile(data: UpdateColumnCommand[], templateId: string) {
    const csvContent = this.createCSVFileHeadingContent(data);
    const fileName = this.fileNameService.getSampleFileName(templateId);
    const sampleFileUrl = this.fileNameService.getSampleFileUrl(templateId);
    await this.storageService.uploadFile(fileName, csvContent, SupportedFileMimeTypesEnum.CSV, true);
    await this.templateRepository.update({ _id: templateId }, { sampleFileUrl });
  }

  createCSVFileHeadingContent(data: UpdateColumnCommand[]): string {
    const headings = data.map((column) => column.key);

    return headings.join(',');
  }
}
