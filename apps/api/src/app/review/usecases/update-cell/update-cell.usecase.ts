import { Injectable } from '@nestjs/common';
import { DalService } from '@impler/dal';
import { UpdateCellCommand } from './update-cell.command';

@Injectable()
export class UpdateRecord {
  constructor(private dalService: DalService) {}

  async execute(_uploadId: string, data: UpdateCellCommand) {
    await this.dalService.updateRecord(_uploadId, data.index, data.record, data.updated);
  }
}
