import { Injectable } from '@nestjs/common';
import { MemberRepository, ProjectRepository } from '@impler/dal';
import { UpdateProjectCommand } from './update-project.command';
import { OperationNotAllowedException } from '@shared/exceptions/operation-no-allowed.exception';
import { AllowedEditProjectRoles } from '@impler/shared';

@Injectable()
export class UpdateProject {
  constructor(private projectRepository: ProjectRepository, private memberRepository: MemberRepository) {}

  async execute(command: UpdateProjectCommand, _projectId: string, _userId: string) {
    const userMember = await this.memberRepository.findOne({ _projectId, _userId });
    if (!userMember) throw new OperationNotAllowedException();

    if (!AllowedEditProjectRoles.includes(userMember.role)) throw new OperationNotAllowedException();

    return this.projectRepository.findOneAndUpdate({ _id: _projectId }, command);
  }
}
