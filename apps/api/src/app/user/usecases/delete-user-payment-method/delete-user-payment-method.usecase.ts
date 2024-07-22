import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/services';

@Injectable()
export class DeleteUserPaymentMethod {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(paymentMethodId: string) {
    return await this.paymentApiService.deleteUserPaymentMethod(paymentMethodId);
  }
}
