import { Injectable } from '@nestjs/common';
import { DestinationsEnum, createRecordFormat, getRecordFormat, updateCombinedFormat } from '@impler/shared';
import { ColumnRepository, CustomizationEntity, CustomizationRepository, TemplateRepository } from '@impler/dal';

import { CONSTANTS } from '@shared/constants';
import { UpdateCustomizationCommand } from './update-customization.command';

@Injectable()
export class UpdateCustomization {
  constructor(
    private customizationRepository: CustomizationRepository,
    private columnRepository: ColumnRepository,
    private templateRepository: TemplateRepository
  ) {}

  async execute(_templateId: string, data: UpdateCustomizationCommand) {
    const customization = await this.customizationRepository.findOne({ _templateId });
    const template = await this.templateRepository.findById(_templateId, 'destination');

    const customizationUpdateData: Partial<CustomizationEntity> = {
      _templateId,
    };

    if (data.combinedFormat && !data.recordFormat && !data.chunkFormat) {
      // when combineFormat is passed from output schema for webhook
      const formats = getRecordFormat(data.combinedFormat);
      if (formats) {
        customizationUpdateData.combinedFormat = data.combinedFormat;
        customizationUpdateData.chunkFormat = formats.chunkFormat;
        customizationUpdateData.recordFormat = formats.recordFormat;
        customizationUpdateData.isCombinedFormatUpdated = data.internal
          ? false
          : data.combinedFormat !== customization.combinedFormat;
      }
    } else if (data.recordFormat && !data.chunkFormat && !data.combinedFormat) {
      // when recordFormat is passed from output schema for bubbleIo
      customizationUpdateData.recordFormat = data.recordFormat;
      customizationUpdateData.isRecordFormatUpdated = data.internal
        ? false
        : data.recordFormat !== customization?.recordFormat;
    } else if (Array.isArray(data.recordVariables) && data.recordVariables.length) {
      // when recordVariables is passed from output schema for webhook
      customizationUpdateData.recordVariables = data.recordVariables;
      if (!customization?.isRecordFormatUpdated) {
        customizationUpdateData.recordFormat = createRecordFormat(
          data.recordVariables,
          template.destination === DestinationsEnum.BUBBLEIO ? CONSTANTS.BUBBLEIO_PROPS : {}
        );
      }
      if (!customization?.isCombinedFormatUpdated) {
        customizationUpdateData.combinedFormat = updateCombinedFormat(CONSTANTS.COMBINED_FORMAT, data.recordVariables);
      }
    }

    let customizationResult = await this.customizationRepository.findOneAndUpdate(
      {
        _templateId,
      },
      customizationUpdateData,
      { upsert: true }
    );

    if (!customizationResult) customizationResult = await this.customizationRepository.findOne({ _templateId });

    return Object.assign(customizationResult, customizationUpdateData);
  }

  async createOrReset(
    _templateId: string,
    { destination, recordVariables }: { destination?: DestinationsEnum; recordVariables?: string[] }
  ) {
    if (destination) {
      if (!recordVariables) {
        const columns = await this.columnRepository.find({ _templateId });
        recordVariables = columns.map((column) => column.key);
      }
      if (destination === DestinationsEnum.WEBHOOK) {
        const combinedFormat = updateCombinedFormat(CONSTANTS.COMBINED_FORMAT, recordVariables);

        return this.execute(_templateId, {
          combinedFormat,
          internal: true,
        });
      } else if (destination == DestinationsEnum.BUBBLEIO || destination == DestinationsEnum.FRONTEND) {
        const recordFormat = createRecordFormat(recordVariables, CONSTANTS.BUBBLEIO_PROPS);

        return this.execute(_templateId, {
          recordFormat,
          internal: true,
        });
      }
    } else {
      return this.customizationRepository.delete({ _templateId });
    }
  }
}
