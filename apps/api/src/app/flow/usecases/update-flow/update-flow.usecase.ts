import { Injectable } from '@nestjs/common';
import { FlowRepository } from '@impler/dal';
import { UpdateFlowCommand } from './update-flow.command';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class UpdateFlow {
  constructor(private flowRepository: FlowRepository) {}

  async execute(command: UpdateFlowCommand) {
    const flowToUpdate = await this.flowRepository.findOne({ _id: command._flowId, _userId: command._userId });
    if (!flowToUpdate) throw new DocumentNotFoundException('Flow', command._flowId);

    return this.flowRepository.findOneAndUpdate(
      {
        _userId: command._userId,
        _id: command._flowId,
      },
      command
    );
  }
}
