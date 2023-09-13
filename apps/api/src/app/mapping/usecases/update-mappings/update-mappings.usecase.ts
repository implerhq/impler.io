import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@impler/dal';
import { ITemplateSchemaItem } from '@impler/shared';

@Injectable()
export class UpdateMappings {
  constructor(private uploadRepository: UploadRepository) {}

  async execute(templateSchema: ITemplateSchemaItem[], _uploadId: string) {
    await this.uploadRepository.update(
      {
        _id: _uploadId,
      },
      { customSchema: JSON.stringify(templateSchema) }
    );
  }
}
