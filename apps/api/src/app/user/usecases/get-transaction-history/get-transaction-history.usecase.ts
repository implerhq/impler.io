import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';
import { DATE_FORMATS } from '@shared/constants';
import { PaymentAPIService } from '@impler/services';

@Injectable()
export class GetTransactionHistory {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(email: string) {
    const transactions = await this.paymentApiService.getTransactionHistory(email);

    return transactions.map((transactionItem) => ({
      transactionDate: dayjs(transactionItem.transactionDate).format(DATE_FORMATS.COMMON),
      planName: transactionItem.planName,
      transactionStatus: transactionItem.transactionStatus,
      membershipDate: transactionItem.membershipDate
        ? dayjs(transactionItem.membershipDate).format(DATE_FORMATS.COMMON)
        : undefined,
      expiryDate: transactionItem.expiryDate
        ? dayjs(transactionItem.expiryDate).format(DATE_FORMATS.COMMON)
        : undefined,
      isPlanActive: transactionItem.isPlanActive,
      charge: transactionItem.charge,
      amount: transactionItem.amount,
      currency: transactionItem.currency,
      _id: transactionItem.id,
    }));
  }
}
