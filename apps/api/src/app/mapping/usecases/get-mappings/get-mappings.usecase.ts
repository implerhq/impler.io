import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@impler/dal';
import { ITemplateSchemaItem } from '@impler/shared';

@Injectable()
export class GetMappings {
  constructor(private uploadRepository: UploadRepository) {}

  async execute(_uploadId: string): Promise<ITemplateSchemaItem[]> {
    const uploadInfo = await this.uploadRepository.findById(_uploadId, 'customSchema');

    return JSON.parse(uploadInfo.customSchema);
  }
}
