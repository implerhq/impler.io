import { CustomizationRepository } from '@impler/dal';
import { getRecordFormat } from '@impler/shared';
import { HttpException, Injectable } from '@nestjs/common';

import { UpdateCustomizationCommand } from './update-customization.command';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class UpdateCustomization {
  constructor(private customizationRepository: CustomizationRepository) {}

  async execute(_templateId: string, data: UpdateCustomizationCommand) {
    if (!data.combinedFormat && !data.chunkFormat && !data.recordFormat) {
      throw new HttpException('At least one of combinedFormat, chunkFormat or recordFormat must be provided.', 400);
    }
    if (!data.recordFormat && !data.chunkFormat) {
      const formats = getRecordFormat(data.combinedFormat);
      if (formats) {
        data.chunkFormat = formats.chunkFormat;
        data.recordFormat = formats.recordFormat;
      }
    }
    const customization = await this.customizationRepository.findOne({ _templateId });
    if (!customization) {
      throw new DocumentNotFoundException('Customization', _templateId);
    }

    return this.customizationRepository.findOneAndUpdate(
      {
        _templateId,
      },
      {
        ...data,
        isCombinedFormatUpdated: data.combinedFormat !== customization.combinedFormat,
        isRecordFormatUpdated: data.recordFormat !== customization.recordFormat,
        isChunkFormatUpdated: data.chunkFormat !== customization.chunkFormat,
      }
    );
  }
}
