import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/services';

@Injectable()
export class UpdateSubscriptionPaymentMethod {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(email: string, paymentMethodId: string) {
    return this.paymentApiService.updatePaymentMethodId(email, paymentMethodId);
  }
}
