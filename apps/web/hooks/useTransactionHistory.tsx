import { commonApi } from '@libs/api';
import { IErrorObject } from '@impler/shared';
import { useQuery } from '@tanstack/react-query';
import { API_KEYS } from '@config';

export function useTransactionHistory() {
  const {
    data: transactions,
    refetch: refetchTransactions,
    isLoading: isTransactionsLoading,
    isFetched: isTransactionsFetched,
  } = useQuery<unknown, IErrorObject, ITransactionHistory[], [string]>([API_KEYS.TRANSACTION_HISTORY], () =>
    commonApi<ITransactionHistory[]>(API_KEYS.TRANSACTION_HISTORY as any, {})
  );

  return {
    transactions,
    refetchTransactions,
    isTransactionsLoading,
    isTransactionsFetched,
  };
}
