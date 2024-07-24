import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/services';

@Injectable()
export class Checkout {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute({
    externalId,
    paymentMethodId,
    planCode,
    couponCode,
  }: {
    externalId: string;
    planCode: string;
    paymentMethodId: string;
    couponCode?: string;
  }) {
    return this.paymentApiService.checkout({
      externalId: externalId,
      planCode: planCode,
      paymentMethodId: paymentMethodId,
      couponCode: couponCode,
    });
  }
}
