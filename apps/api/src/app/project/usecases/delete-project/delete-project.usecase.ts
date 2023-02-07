import { Injectable } from '@nestjs/common';
import { ProjectRepository, MemberRepository } from '@impler/dal';
import { OperationNotAllowedException } from '@shared/exceptions/operation-no-allowed.exception';

@Injectable()
export class DeleteProject {
  constructor(private projectRepository: ProjectRepository, private memberRepository: MemberRepository) {}

  async execute(_projectId: string, _userId: string) {
    const userMember = await this.memberRepository.findOne({ _projectId, _userId });
    if (!userMember) throw new OperationNotAllowedException();

    return this.projectRepository.delete({ _id: _projectId });
  }
}
