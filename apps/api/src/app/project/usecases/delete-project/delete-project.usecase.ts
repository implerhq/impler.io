import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@impler/dal';
import { OperationNotAllowedException } from '@shared/exceptions/operation-no-allowed.exception';

@Injectable()
export class DeleteProject {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(_projectId: string, _userId: string) {
    const userMember = await this.projectRepository.findOne({ _projectId, _userId });
    if (!userMember) throw new OperationNotAllowedException();

    return this.projectRepository.delete({ _id: _projectId });
  }
}
