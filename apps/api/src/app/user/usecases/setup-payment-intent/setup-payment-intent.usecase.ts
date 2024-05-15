import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/shared';

@Injectable()
export class SetupPaymentIntent {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(email: string, paymentMethodId: string) {
    return await this.paymentApiService.updatePaymentMethod(email, paymentMethodId);
  }
}
