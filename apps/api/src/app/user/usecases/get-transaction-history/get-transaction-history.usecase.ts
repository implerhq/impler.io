import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/services';
import { EnvironmentRepository } from '@impler/dal';
import { PaginationCommand } from '@shared/commands/pagination.command';
import { PaginationResult } from '@impler/shared';
import { GetTransactionHistoryCommand } from './get-transaction-command';

@Injectable()
export class GetTransactionHistory extends PaginationCommand {
  constructor(
    private paymentApiService: PaymentAPIService,
    private environmentRepository: EnvironmentRepository
  ) {
    super();
  }

  async execute({ projectId, limit, page }: GetTransactionHistoryCommand): Promise<PaginationResult> {
    const teamOwner = await this.environmentRepository.getTeamOwnerDetails(projectId);
    const transactions = await this.paymentApiService.getTransactionHistory({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      email: teamOwner._userId.email,
      limit,
      page,
    });

    const data = transactions.data.map((transactionItem) => ({
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

    return {
      data,
      limit,
      page,
      totalPages: transactions.totalPages,
      totalRecords: transactions.data.length,
    };
  }
}
