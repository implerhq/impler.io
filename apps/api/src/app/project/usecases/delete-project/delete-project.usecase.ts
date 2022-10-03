import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@impler/dal';

@Injectable()
export class DeleteProject {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(id: string) {
    return this.projectRepository.delete({ _id: id });
  }
}
