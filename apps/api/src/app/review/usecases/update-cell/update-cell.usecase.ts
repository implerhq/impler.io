import { Injectable } from '@nestjs/common';
import { DalService, RecordEntity } from '@impler/dal';

@Injectable()
export class UpdateRecord {
  constructor(private dalService: DalService) {}

  async execute(_uploadId: string, record: RecordEntity) {
    await this.dalService.updateRecord(_uploadId, record.index, record);
  }
}
