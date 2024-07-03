import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/shared';

@Injectable()
export class DeleteUserPaymentMethod {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(paymentMethodId: string) {
    return await this.paymentApiService.deleteUserPaymentMethod(paymentMethodId);
  }
}
