import { Injectable } from '@nestjs/common';
import { MemberEntity, MemberRepository } from '@impler/dal';
import { AddMemberCommand } from './add-member.command';
import { MemberRoleEnum, MemberStatusEnum } from '@impler/shared';

@Injectable()
export class AddMember {
  constructor(private memberRepository: MemberRepository) {}

  async execute(command: AddMemberCommand) {
    const memberData: Partial<MemberEntity> = {
      _projectId: command._projectId,
      _userId: command._userId,
      memberStatus: MemberStatusEnum.ACTIVE,
      role: MemberRoleEnum.ADMIN,
    };

    return this.memberRepository.create(memberData);
  }
}
