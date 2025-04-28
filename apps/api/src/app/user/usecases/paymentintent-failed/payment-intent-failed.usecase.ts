import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/services';
import { EnvironmentRepository } from '@impler/dal';

@Injectable()
export class PaymentIntentFailed {
  constructor(
    private paymentApiService: PaymentAPIService,
    private environmentRepository: EnvironmentRepository
  ) {}

  async execute(projectId: string, paymentIntentId?: string) {
    const teamOwner = await this.environmentRepository.getTeamOwnerDetails(projectId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore

    return await this.paymentApiService.paymentIntentFailed(teamOwner._userId.email, paymentIntentId);
  }
}
