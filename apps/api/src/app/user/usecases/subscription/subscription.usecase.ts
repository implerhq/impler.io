import { PaymentAPIService } from '@impler/services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Subscription {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute({
    email,
    planCode,
    selectedPaymentMethod,
    couponCode,
  }: {
    email: string;
    planCode: string;
    selectedPaymentMethod: string;
    couponCode?: string;
  }) {
    return await this.paymentApiService.subscribe({
      planCode,
      email,
      selectedPaymentMethod,
      couponCode,
    });
  }
}
