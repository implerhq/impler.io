import { Injectable } from '@nestjs/common';
import * as dockerNames from 'docker-names';
import { FlowRepository } from '@impler/dal';
import { CreateFlowCommand } from './create-flow.command';

@Injectable()
export class CreateFlow {
  constructor(private flowRepository: FlowRepository) {}

  async execute(command: CreateFlowCommand) {
    return this.flowRepository.create({
      _userId: command._userId,
      name: dockerNames.getRandomName(),
    });
  }
}
