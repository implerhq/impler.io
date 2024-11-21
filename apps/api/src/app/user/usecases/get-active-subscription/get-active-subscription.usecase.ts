import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { DATE_FORMATS } from '@shared/constants';
import { ISubscriptionData } from '@impler/shared';
import { PaymentAPIService } from '@impler/services';
import { EnvironmentRepository } from '@impler/dal';

@Injectable()
export class GetActiveSubscription {
  constructor(
    private paymentApiService: PaymentAPIService,
    private environmentRepository: EnvironmentRepository
  ) {}

  async execute(projectId: string): Promise<ISubscriptionData> {
    const teamOwner = await this.environmentRepository.getTeamOwnerDetails(projectId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const activeSubscription = await this.paymentApiService.fetchActiveSubscription(teamOwner._userId.email);
    if (!activeSubscription) {
      return null;
    }

    activeSubscription.expiryDate = dayjs(activeSubscription.expiryDate).format(DATE_FORMATS.COMMON);

    return activeSubscription;
  }
}
