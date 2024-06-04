import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/shared';

@Injectable()
export class CancelSubscription {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(userEmail: string) {
    return this.paymentApiService.cancelSubscription(userEmail);
  }
}