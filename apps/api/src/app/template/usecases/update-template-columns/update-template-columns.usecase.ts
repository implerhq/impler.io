import { Injectable } from '@nestjs/common';

import { CONSTANTS } from '@shared/constants';
import { FileMimeTypesEnum } from '@impler/shared';
import { FileNameService } from '@shared/file/name.service';
import { StorageService } from '@impler/shared/dist/services/storage';
import { AddColumnCommand } from 'app/column/commands/add-column.command';
import { ColumnRepository, CustomizationRepository, TemplateRepository } from '@impler/dal';

@Injectable()
export class UpdateTemplateColumns {
  constructor(
    private columnRepository: ColumnRepository,
    private storageService: StorageService,
    private fileNameService: FileNameService,
    private templateRepository: TemplateRepository,
    private customizationRepository: CustomizationRepository
  ) {}

  async execute(command: AddColumnCommand[], _templateId: string) {
    await this.columnRepository.deleteMany({ _templateId });
    await this.saveSampleFile(command, _templateId);
    await this.updateCustomizationData(command, _templateId);

    return this.columnRepository.createMany(command);
  }

  async saveSampleFile(data: AddColumnCommand[], templateId: string) {
    const csvContent = this.createCSVFileHeadingContent(data);
    const fileName = this.fileNameService.getSampleFileName(templateId);
    const sampleFileUrl = this.fileNameService.getSampleFileUrl(templateId);
    await this.storageService.uploadFile(fileName, csvContent, FileMimeTypesEnum.CSV);
    await this.templateRepository.update({ _id: templateId }, { sampleFileUrl });
  }

  listRecordVariables(data: AddColumnCommand[]): string[] {
    return data.map((column) => `record.${column.key}`);
  }

  createRecordFormat(data: AddColumnCommand[]): string {
    const recordVariables = this.listRecordVariables(data);
    const recordFormat = recordVariables.reduce((acc, variable) => {
      return { ...acc, [variable]: '' };
    }, {});

    return JSON.stringify(recordFormat);
  }

  async updateCustomizationData(data: AddColumnCommand[], templateId: string) {
    let customization = await this.customizationRepository.findOne({
      _templateId: templateId,
    });
    if (!customization) {
      customization = await this.customizationRepository.create({
        _templateId: templateId,
        chunkFormat: CONSTANTS.CHUNK_FORMAT,
        recordFormat: '{}',
        chunkVariables: CONSTANTS.CHUNK_VARIABLES,
      });
    }
    customization.recordVariables = this.listRecordVariables(data);

    if (!customization.isRecordFormatUpdated) {
      customization.recordFormat = this.createRecordFormat(data);
    }

    await this.customizationRepository.update({ _id: templateId }, customization);
  }

  createCSVFileHeadingContent(data: AddColumnCommand[]): string {
    const headings = data.map((column) => column.key);

    return headings.join(',');
  }
}
