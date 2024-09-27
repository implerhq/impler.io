import { Injectable } from '@nestjs/common';
import { EnvironmentRepository, ProjectInvitationRepository } from '@impler/dal';
import { PaymentAPIService } from '@impler/services';

@Injectable()
export class TeamMemberMeta {
  constructor(
    private environmentRepository: EnvironmentRepository,
    private paymentAPIService: PaymentAPIService,
    private projectInvitationRepository: ProjectInvitationRepository
  ) {}

  async exec(projectId: string) {
    const teamMembers = await this.environmentRepository.getProjectTeamMembers(projectId);

    const teamMember = teamMembers.find((member) => member.isOwner);

    const invitationCount = await this.projectInvitationRepository.count({
      _projectId: projectId,
    });

    if (teamMember && teamMember._userId) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const subscription = await this.paymentAPIService.fetchActiveSubscription(teamMember._userId.email);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const allocated = subscription.meta.TEAM_MEMBERS;

      const total = teamMembers.length + invitationCount;

      const available = allocated - total;

      return { available, total };
    } else {
      return null;
    }
  }
}
