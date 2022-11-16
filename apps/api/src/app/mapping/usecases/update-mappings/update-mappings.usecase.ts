import { Injectable } from '@nestjs/common';
import { MappingRepository } from '@impler/dal';
import { UpdateMappingCommand } from './update-mappings.command';

@Injectable()
export class UpdateMappings {
  constructor(private mappingRepository: MappingRepository) {}

  async execute(command: UpdateMappingCommand[], _uploadId: string) {
    await this.mappingRepository.deleteMany({ _uploadId });

    return this.mappingRepository.createMany(command);
  }
}
