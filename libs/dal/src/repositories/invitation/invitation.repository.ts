import { BaseRepository } from '../base-repository';
import { InvitationEntity } from './invitation.entity';
import { Invitation } from './invitation.schema';

export class InvitationRepository extends BaseRepository<InvitationEntity> {
  constructor() {
    super(Invitation, InvitationEntity);
  }
}
