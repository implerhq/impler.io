import { Injectable } from '@nestjs/common';
import { TemplateRepository, CustomizationRepository, ColumnRepository, ValidatorRepository } from '@impler/dal';
import { validateNotFound } from '@shared/helpers/common.helper';
import { DuplicateTemplateCommand } from './duplicate-template.command';
import { SaveSampleFile } from '@shared/usecases/save-sample-file/save-sample-file.usecase';

@Injectable()
export class DuplicateTemplate {
  constructor(
    private saveSampleFile: SaveSampleFile,
    private columnRepository: ColumnRepository,
    private templateRepository: TemplateRepository,
    private validatorRepository: ValidatorRepository,
    private customizationRepository: CustomizationRepository
  ) {}

  async execute(_templateId: string, command: DuplicateTemplateCommand) {
    const templateData = await this.templateRepository.findById(
      _templateId,
      'name callbackUrl chunkSize authHeaderName chunkSize'
    );

    validateNotFound(templateData, 'template');

    const newTemplate = await this.templateRepository.create({
      name: command.name,
      _projectId: command._projectId,
      chunkSize: templateData.chunkSize,
      ...(command.duplicateWebhook && {
        callbackUrl: templateData.callbackUrl,
        authHeaderName: templateData.authHeaderName,
      }),
    });

    if (command.duplicateColumns) {
      const columns = await this.columnRepository.find(
        {
          _templateId,
        },
        '-_id name key alternateKeys isRequired isUnique type regex regexDescription selectValues dateFormats sequence defaultValue'
      );

      await this.columnRepository.createMany(
        columns.map((column) => {
          return {
            ...column,
            _templateId: newTemplate._id,
          };
        })
      );

      await this.saveSampleFile.execute(columns, newTemplate._id);
    }

    if (command.duplicateOutput) {
      const validation = await this.customizationRepository.findOne(
        {
          _templateId,
        },
        '-_id recordVariables chunkVariables recordFormat chunkFormat combinedFormat isRecordFormatUpdated isChunkFormatUpdated isCombinedFormatUpdated'
      );

      await this.customizationRepository.create({
        _templateId: newTemplate._id,
        ...validation,
      });
    }

    if (command.duplicateValidator) {
      const validator = await this.validatorRepository.findOne({ _templateId }, '-_id onBatchInitialize');
      await this.validatorRepository.create({
        _templateId: newTemplate._id,
        ...validator,
      });
    }

    return newTemplate;
  }
}
