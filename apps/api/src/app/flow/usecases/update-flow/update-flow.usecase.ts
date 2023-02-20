import { Injectable } from '@nestjs/common';
import { FlowRepository } from '@impler/dal';
import { UpdateFlowCommand } from './update-flow.command';

@Injectable()
export class UpdateFlow {
  constructor(private flowRepository: FlowRepository) {}

  async execute(command: UpdateFlowCommand) {
    return this.flowRepository.findOneAndUpdate(
      {
        _userId: command._userId,
        _id: command._flowId,
      },
      command
    );
  }
}
