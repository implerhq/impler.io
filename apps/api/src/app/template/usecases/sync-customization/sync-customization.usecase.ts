import { Injectable } from '@nestjs/common';

import { CONSTANTS } from '@shared/constants';
import { createRecordFormat, updateCombinedFormat } from '@impler/shared';
import { CustomizationRepository } from '@impler/dal';

@Injectable()
export class SyncCustomization {
  constructor(private customizationRepository: CustomizationRepository) {}

  async execute(_templateId: string) {
    const customization = await this.customizationRepository.findOne({
      _templateId,
    });
    customization.isChunkFormatUpdated = false;
    customization.isRecordFormatUpdated = false;
    customization.isCombinedFormatUpdated = false;

    customization.recordFormat = createRecordFormat(customization.recordVariables);
    customization.combinedFormat = updateCombinedFormat(CONSTANTS.COMBINED_FORMAT, customization.recordVariables);

    await this.customizationRepository.update({ _templateId }, customization);

    return customization;
  }
}
