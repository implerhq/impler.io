import { Injectable } from '@nestjs/common';
import { FlowRepository } from '@impler/dal';
import { GetFlowsCommand } from './get-flows.command';

@Injectable()
export class GetFlows {
  constructor(private flowRepository: FlowRepository) {}

  async execute(command: GetFlowsCommand) {
    return this.flowRepository.find(
      {
        _userId: command._userId,
      },
      'name',
      {
        limit: command.limit,
        skip: command.offset,
      }
    );
  }
}
