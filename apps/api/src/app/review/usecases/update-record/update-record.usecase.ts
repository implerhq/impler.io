import { Injectable } from '@nestjs/common';
import { DalService } from '@impler/dal';
import { UpdateRecordCommand } from './update-record.command';

@Injectable()
export class UpdateRecord {
  constructor(private dalService: DalService) {}

  async execute(_uploadId: string, data: UpdateRecordCommand) {
    return this.dalService.updateRecord(_uploadId, data.index, data.record, data.updated);
  }
}
