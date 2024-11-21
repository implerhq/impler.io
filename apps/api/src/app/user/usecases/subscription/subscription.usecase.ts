import { PaymentAPIService } from '@impler/services';
import { Injectable } from '@nestjs/common';
import { EnvironmentRepository } from '@impler/dal';

@Injectable()
export class Subscription {
  constructor(
    private paymentApiService: PaymentAPIService,
    private environmentRepository: EnvironmentRepository
  ) {}

  async execute({
    projectId,
    planCode,
    selectedPaymentMethod,
    couponCode,
  }: {
    projectId: string;
    planCode: string;
    selectedPaymentMethod: string;
    couponCode?: string;
  }) {
    const teamOwner = await this.environmentRepository.getTeamOwnerDetails(projectId);

    return await this.paymentApiService.subscribe({
      planCode,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      email: teamOwner._userId.email,
      selectedPaymentMethod,
      couponCode,
    });
  }
}
