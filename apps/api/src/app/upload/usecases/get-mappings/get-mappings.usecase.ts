import { Injectable } from '@nestjs/common';
import { MappingRepository } from '@impler/dal';

@Injectable()
export class GetMappings {
  constructor(private mappingRepository: MappingRepository) {}

  async execute(_uploadId: string) {
    return await this.mappingRepository.getMappingInfo(_uploadId);
  }
}
