import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/services';
import { EnvironmentRepository } from '@impler/dal';

@Injectable()
export class Checkout {
  constructor(
    private paymentApiService: PaymentAPIService,
    private environmentRepository: EnvironmentRepository
  ) {}

  async execute({
    projectId,
    paymentMethodId,
    planCode,
    couponCode,
  }: {
    projectId: string;
    planCode: string;
    paymentMethodId: string;
    couponCode?: string;
  }) {
    const teamOwner = await this.environmentRepository.getTeamOwnerDetails(projectId);

    return this.paymentApiService.checkout({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      externalId: teamOwner._userId.email,
      planCode: planCode,
      paymentMethodId: paymentMethodId,
      couponCode: couponCode,
    });
  }
}
