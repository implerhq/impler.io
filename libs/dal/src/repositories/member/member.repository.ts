import { MemberEntity } from './member.entity';
import { BaseRepository } from '../base-repository';
import { Member } from './member.schema';

export class MemberRepository extends BaseRepository<MemberEntity> {
  constructor() {
    super(Member, MemberEntity);
  }
}
