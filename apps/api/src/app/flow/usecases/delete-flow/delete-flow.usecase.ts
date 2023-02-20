import { Injectable } from '@nestjs/common';
import { FlowRepository } from '@impler/dal';
import { DeleteFlowCommand } from './delete-flow.command';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';

@Injectable()
export class DeleteFlow {
  constructor(private flowRepository: FlowRepository) {}

  async execute(command: DeleteFlowCommand) {
    const flowToDelete = await this.flowRepository.findOne({
      _id: command._flowId,
      _userId: command._userId,
    });
    if (!flowToDelete) throw new DocumentNotFoundException('Flow', command._flowId);

    return this.flowRepository.delete({
      _id: command._flowId,
      _userId: command._userId,
    });
  }
}
