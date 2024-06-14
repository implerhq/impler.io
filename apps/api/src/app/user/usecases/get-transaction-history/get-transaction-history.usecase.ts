import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/shared';
import { CONSTANTS, DATE_FORMATS } from '@shared/constants';

@Injectable()
export class GetTransactionHistory {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(email: string) {
    const transactions = await this.paymentApiService.getTransactionHistory(email);

    return transactions.map((transactionItem) => ({
      transactionDate: dayjs(transactionItem.transactionDate).format(DATE_FORMATS.COMMON),
      planName: transactionItem.planName,
      transactionStatus: transactionItem.transactionStatus,
      membershipDate: dayjs(transactionItem.membershipDate).format(DATE_FORMATS.COMMON),
      expiryDate: dayjs(transactionItem.expiryDate).format(DATE_FORMATS.COMMON),
      isPlanActive: transactionItem.isPlanActive,
      charge: transactionItem.charge,
      amount: transactionItem.amount,
      currency: transactionItem.currency ? transactionItem.currency : CONSTANTS.DEFAULT_CURRENCY,
      _id: transactionItem.id,
    }));
  }
}
