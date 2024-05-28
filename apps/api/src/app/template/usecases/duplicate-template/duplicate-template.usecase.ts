import { Injectable } from '@nestjs/common';
import {
  TemplateRepository,
  CustomizationRepository,
  ColumnRepository,
  ValidatorRepository,
  WebhookDestinationRepository,
  BubbleDestinationRepository,
} from '@impler/dal';
import { DestinationsEnum } from '@impler/shared';
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
    private customizationRepository: CustomizationRepository,
    private buubleIoDestinationRepository: BubbleDestinationRepository,
    private webhookDestinationRepository: WebhookDestinationRepository
  ) {}

  async execute(_templateId: string, command: DuplicateTemplateCommand) {
    const templateData = await this.templateRepository.findById(_templateId, 'name destination');

    validateNotFound(templateData, 'template');

    const newTemplate = await this.templateRepository.create({
      name: command.name,
      _projectId: command._projectId,
    });

    if (command.duplicateDestination) {
      if (templateData.destination === DestinationsEnum.WEBHOOK) {
        const webhookDestination = await this.webhookDestinationRepository.find({ _templateId });
        await this.webhookDestinationRepository.create({
          _templateId: newTemplate._id,
          ...webhookDestination,
        });
      } else if (templateData.destination === DestinationsEnum.BUBBLEIO) {
        const bubbleDestination = await this.buubleIoDestinationRepository.find({ _templateId });
        await this.buubleIoDestinationRepository.create({
          _templateId: newTemplate._id,
          ...bubbleDestination,
        });
      }
    }

    if (command.duplicateColumns && templateData.destination !== DestinationsEnum.BUBBLEIO) {
      const columns = await this.columnRepository.find(
        {
          _templateId,
        },
        // eslint-disable-next-line max-len
        '-_id name key alternateKeys isRequired isUnique type regex regexDescription selectValues dateFormats sequence defaultValue allowMultiSelect'
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
        // eslint-disable-next-line max-len
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
