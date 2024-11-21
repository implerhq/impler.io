import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@impler/dal';
import { ISetHeaderData } from '@impler/shared';

@Injectable()
export class SetHeaderRow {
  constructor(private uploadRepository: UploadRepository) {}

  async execute(_uploadId: string, data: ISetHeaderData) {
    return this.uploadRepository.update(
      { _id: _uploadId },
      {
        $set: {
          headings: data.headings,
          headerRow: typeof data.index !== 'undefined' ? data.index : -1,
        },
      }
    );
  }
}
