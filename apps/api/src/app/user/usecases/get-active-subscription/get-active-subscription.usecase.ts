import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { DATE_FORMATS } from '@shared/constants';
import { ISubscriptionData, PaymentAPIService } from '@impler/shared';

@Injectable()
export class GetActiveSubscription {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(userEmail: string): Promise<ISubscriptionData> {
    const subscription = await this.paymentApiService.fetchActiveSubscription(userEmail);

    return {
      ...subscription,
      expiryDate: dayjs(subscription.expiryDate).format(DATE_FORMATS.COMMON),
    };
  }
}
