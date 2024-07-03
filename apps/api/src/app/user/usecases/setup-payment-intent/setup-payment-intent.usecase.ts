import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/shared';

@Injectable()
export class UpdatePaymentMethod {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(email: string, paymentId: string) {
    return await this.paymentApiService.updatePaymentMethod(email, paymentId);
  }
}
