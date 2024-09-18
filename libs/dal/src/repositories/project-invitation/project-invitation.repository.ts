import { ProjectEntity } from '../project';
import { BaseRepository } from '../base-repository';
import { ProjectInvitation } from './project-invitation.schema';
import { ProjectInvitationEntity } from './project-invitation.entity';

export class ProjectInvitationRepository extends BaseRepository<ProjectInvitationEntity> {
  constructor() {
    super(ProjectInvitation, ProjectInvitationEntity);
  }
  async getInvitationData(invitationId: string, token: string) {
    const invitation = await ProjectInvitation.findOne({ _id: invitationId, token }).populate('_projectId', 'name');
    if (!invitation) return null;

    return {
      email: invitation.invitationToEmail,
      invitedBy: invitation.invitedBy,
      projectName: (invitation._projectId as unknown as ProjectEntity).name,
    };
  }
}
