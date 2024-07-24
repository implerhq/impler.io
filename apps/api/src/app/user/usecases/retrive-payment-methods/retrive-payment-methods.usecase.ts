import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/services';

@Injectable()
export class RetrievePaymentMethods {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(email: string) {
    return await this.paymentApiService.retriveUserPaymentMethods(email);
  }
}
