import { Injectable } from '@nestjs/common';
import { ISubscriptionData, PaymentAPIService } from '@impler/shared';

@Injectable()
export class GetActiveSubscription {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(userEmail: string): Promise<ISubscriptionData> {
    return await this.paymentApiService.fetchActiveSubscription(userEmail);
  }
}
