import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { DATE_FORMATS } from '@shared/constants';
import { PaymentAPIService } from '@impler/services';
import { EnvironmentRepository } from '@impler/dal';

@Injectable()
export class CancelSubscription {
  constructor(
    private paymentApiService: PaymentAPIService,
    private environmentRepository: EnvironmentRepository
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  async execute(projectId: string, cancellationReasons: string[]) {
    const teamOwner = await this.environmentRepository.getTeamOwnerDetails(projectId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const canceledSubscription = await this.paymentApiService.cancelSubscription(teamOwner._userId.email);

    canceledSubscription.expiryDate = dayjs(canceledSubscription.expiryDate).format(DATE_FORMATS.COMMON);

    return canceledSubscription;
  }
}
