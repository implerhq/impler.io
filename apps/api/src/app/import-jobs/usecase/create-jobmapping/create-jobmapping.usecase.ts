import { JobMappingRepository } from '@impler/dal';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobMappingCommand } from './create-jobmapping.command';

@Injectable()
export class CreateJobMapping {
  constructor(private readonly jobMappingRepository: JobMappingRepository) {}

  async execute(jobMappingCommand: CreateJobMappingCommand[]) {
    jobMappingCommand.filter((command) => !!command.key).map((command) => command.key);

    for (const mappingCommand of jobMappingCommand) {
      if (mappingCommand.isRequired && !mappingCommand.path) {
        throw new BadRequestException(`${mappingCommand.name} is required`);
      }
    }

    return this.jobMappingRepository.createMany(jobMappingCommand);
  }
}
