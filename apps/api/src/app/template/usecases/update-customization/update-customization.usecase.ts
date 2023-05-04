import { Injectable } from '@nestjs/common';
import { CustomizationRepository } from '@impler/dal';
import { UpdateCustomizationCommand } from './update-customization.command';

@Injectable()
export class UpdateCustomization {
  constructor(private customizationRepository: CustomizationRepository) {}

  async execute(_templateId: string, data: UpdateCustomizationCommand) {
    return this.customizationRepository.findOneAndUpdate(
      {
        _templateId,
      },
      {
        ...data,
        isRecordFormatUpdated: true,
        isChunkFormatUpdated: true,
      }
    );
  }
}
