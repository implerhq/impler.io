import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@impler/dal';
import { ISchemaColumn } from '@impler/shared';

@Injectable()
export class GetUploadColumns {
  constructor(private uploadRepository: UploadRepository) {}

  async execute(_uploadId: string) {
    const upload = await this.uploadRepository.findById(_uploadId, 'customSchema');
    const columns = JSON.parse(upload.customSchema) as ISchemaColumn[];

    return columns.sort((a, b) => (a.isFrozen === b.isFrozen ? 0 : a.isFrozen ? -1 : 1));
  }
}
