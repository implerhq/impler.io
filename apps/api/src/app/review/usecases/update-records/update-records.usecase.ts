import { Injectable } from '@nestjs/common';
import { DalService } from '@impler/dal';
import { UpdateRecordCommand } from '../update-record/update-record.command';

@Injectable()
export class UpdateRecords {
  constructor(private dalService: DalService) {}

  async execute(_uploadId: string, data: UpdateRecordCommand[]) {
    return this.dalService.updateRecords(_uploadId, data) as Promise<unknown>;
  }
}
