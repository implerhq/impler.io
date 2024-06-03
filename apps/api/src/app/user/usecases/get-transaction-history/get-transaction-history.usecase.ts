import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/shared';

@Injectable()
export class GetTransactionHistory {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(email: string) {
    const transactions = await this.paymentApiService.getTransactionHistory(email);

    return transactions.map((transactionItem) => ({
      transactionDate: transactionItem.transactionDate,
      planName: transactionItem.planName,
      transactionStatus: transactionItem.transactionStatus,
      membershipDate: transactionItem.membershipDate,
      expiryDate: transactionItem.expiryDate,
      isPlanActive: transactionItem.isPlanActive,
      charge: transactionItem.charge,
      _id: transactionItem.id,
    }));
  }
}
