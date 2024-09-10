import { BaseRepository } from '../base-repository';
import { ProjectInvitationEntity } from './project-invitation.entity';
import { ProjectInvitation } from './project-invitation.schema';

export class ProjectInvitationRepository extends BaseRepository<ProjectInvitationEntity> {
  constructor() {
    super(ProjectInvitation, ProjectInvitationEntity);
  }
}
