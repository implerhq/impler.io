import { Injectable } from '@nestjs/common';
import { CustomizationRepository } from '@impler/dal';
import { UpdateCustomizationCommand } from './update-customization.command';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';
import { createVariable } from '@impler/shared';

@Injectable()
export class UpdateCustomization {
  constructor(private customizationRepository: CustomizationRepository) {}

  async execute(_templateId: string, data: UpdateCustomizationCommand) {
    const customization = await this.customizationRepository.findOne({ _templateId });
    if (!customization) {
      throw new DocumentNotFoundException('Customization', _templateId);
    }

    this.customizationRepository.findOneAndUpdate(
      {
        _templateId,
      },
      {
        ...data,
        isRecordFormatUpdated: data.recordFormat !== customization.recordFormat,
        isChunkFormatUpdated: data.chunkFormat !== customization.chunkFormat,
      }
    );

    return {
      ...customization,
      recordVariables: customization.recordVariables?.map((variable) => createVariable(variable)),
      chunkVariables: customization.chunkVariables?.map((variable) => createVariable(variable)),
    };
  }
}
