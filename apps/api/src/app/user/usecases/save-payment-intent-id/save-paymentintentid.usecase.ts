import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/services';

@Injectable()
export class ConfirmIntentId {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(email: string, intentId: string) {
    return await this.paymentApiService.confirmPaymentIntentId(email, intentId);
  }
}
