import { Injectable } from '@nestjs/common';
import { ColumnRepository, TemplateRepository } from '@impler/dal';
import { UpdateColumnCommand } from './update-columns.command';
import { CSVFileService } from '../../../shared/file/file.service';
import { StorageService } from '../../../shared/storage/storage.service';
import { FileNameService } from '../../../shared/file/name.service';

@Injectable()
export class UpdateColumns {
  constructor(
    private columnRepository: ColumnRepository,
    private csvFileService: CSVFileService,
    private storageService: StorageService,
    private fileNameService: FileNameService,
    private templateRepository: TemplateRepository
  ) {}

  async execute(command: UpdateColumnCommand[], templateId: string) {
    await this.columnRepository.delete({ templateId });
    this.saveSampleFile(command, templateId);

    return this.columnRepository.createMany(command);
  }

  async saveSampleFile(data: UpdateColumnCommand[], templateId: string) {
    const fields = data.map((column) => column.columnKeys[0]);
    const csvContent = this.csvFileService.convertFromJson({}, fields);
    const fileName = this.fileNameService.getSampleFileName(templateId);
    const sampleFileUrl = this.fileNameService.getSampleFileUrl(templateId);
    await this.csvFileService.saveFile(this.storageService, csvContent, fileName, true);
    await this.templateRepository.update({ _id: templateId }, { sampleFileUrl });
  }
}
