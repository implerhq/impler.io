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

      const available = Math.max(allocated - total, 0);

      const result = { available, total, allocated, error: null };

      if (available <= 0) {
        result.error = 'You Have Reached the Limit or Invited the Maximum Team Members';
      }

      return result;
    } else {
      return { error: 'No owner found', available: null, total: null, allocated: null };
    }
  }
}
