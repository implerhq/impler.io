import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/services';

@Injectable()
export class GetTransactionHistory {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(email: string) {
    const transactions = await this.paymentApiService.getTransactionHistory(email);

    return transactions.map((transactionItem) => ({
      transactionDate: transactionItem.transactionDate,
      planName: transactionItem.planName,
      transactionStatus: transactionItem.transactionStatus,
      membershipDate: transactionItem.membershipDate ? transactionItem.membershipDate : undefined,
      expiryDate: transactionItem.expiryDate ? transactionItem.expiryDate : undefined,
      isPlanActive: transactionItem.isPlanActive,
      charge: transactionItem.charge,
      amount: transactionItem.amount,
      currency: transactionItem.currency,
      _id: transactionItem.id,
    }));
  }
}
