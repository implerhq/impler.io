import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/shared';
import * as dayjs from 'dayjs';

@Injectable()
export class GetTransactionHistory {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(email: string) {
    const transactions = await this.paymentApiService.getTransactionHistory(email);

    return transactions.map((transactionItem) => ({
      transactionDate: dayjs(transactionItem.transactionDate).format('DD-MM-YYYY'),
      planName: transactionItem.planName,
      transactionStatus: transactionItem.transactionStatus,
      membershipDate: dayjs(transactionItem.membershipDate).format('DD-MM-YYYY'),
      expiryDate: dayjs(transactionItem.expiryDate).format('DD-MM-YYYY'),
      isPlanActive: transactionItem.isPlanActive,
      charge: transactionItem.charge,
      amount: transactionItem.amount,
      currency: transactionItem.currency ? transactionItem.currency : 'usd',
      _id: transactionItem.id,
    }));
  }
}
