import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/services';
import { EnvironmentRepository } from '@impler/dal';

@Injectable()
export class GetTransactionHistory {
  constructor(
    private paymentApiService: PaymentAPIService,
    private environmentRepository: EnvironmentRepository
  ) {}

  async execute(projectId: string) {
    const teamOwner = await this.environmentRepository.getTeamOwnerDetails(projectId);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const transactions = await this.paymentApiService.getTransactionHistory(teamOwner._userId.email);

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
