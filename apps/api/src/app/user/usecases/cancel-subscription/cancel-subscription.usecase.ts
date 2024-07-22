import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { DATE_FORMATS } from '@shared/constants';
import { PaymentAPIService } from '@impler/services';

@Injectable()
export class CancelSubscription {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(userEmail: string) {
    const cancelledSubscription = await this.paymentApiService.cancelSubscription(userEmail);
    cancelledSubscription.expiryDate = dayjs(cancelledSubscription.expiryDate).format(DATE_FORMATS.COMMON);

    return cancelledSubscription;
  }
}
