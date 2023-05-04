import { Injectable } from '@nestjs/common';
import { FileMimeTypesEnum } from '@impler/shared';
import { FileNameService } from '@shared/file/name.service';
import { createRecordFormat } from '@shared/helpers/common.helper';
import { StorageService } from '@impler/shared/dist/services/storage';
import { UpdateColumnCommand } from '../../commands/update-column.command';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';
import { ColumnRepository, TemplateRepository, CustomizationRepository } from '@impler/dal';
import { CONSTANTS } from '@shared/constants';

@Injectable()
export class UpdateColumn {
  constructor(
    private columnRepository: ColumnRepository,
    private storageService: StorageService,
    private fileNameService: FileNameService,
    private templateRepository: TemplateRepository,
    private customizationRepository: CustomizationRepository
  ) {}

  async execute(command: UpdateColumnCommand, _id: string) {
    let column = await this.columnRepository.findOne({ _id });
    if (!column) {
      throw new DocumentNotFoundException('Column', _id);
    }

    const isKeyUpdated = command.key !== column.key;

    column = await this.columnRepository.findOneAndUpdate({ _id }, command);
    const columns = await this.columnRepository.find({ _templateId: column._templateId });
    const columnKeys = columns.map((columnItem) => columnItem.key);
    await this.saveSampleFile(columnKeys.join(','), column._templateId);

    if (isKeyUpdated) {
      const variables = columns.map((columnItem) => CONSTANTS.RECORD_VARIABLE_PREFIX + columnItem.key);
      await this.updateCustomization(column._templateId, variables);
    }

    return column;
  }

  async updateCustomization(_templateId: string, variables: string[]) {
    const customization = await this.customizationRepository.findOne({
      _templateId,
    });
    customization.recordVariables = variables;
    if (!customization.isRecordFormatUpdated) {
      customization.recordFormat = createRecordFormat(variables);
    }
    await this.customizationRepository.update({ _templateId }, customization);
  }

  async saveSampleFile(csvContent: string, templateId: string) {
    const fileName = this.fileNameService.getSampleFileName(templateId);
    const sampleFileUrl = this.fileNameService.getSampleFileUrl(templateId);
    await this.storageService.uploadFile(fileName, csvContent, FileMimeTypesEnum.CSV);
    await this.templateRepository.update({ _id: templateId }, { sampleFileUrl });
  }
}
