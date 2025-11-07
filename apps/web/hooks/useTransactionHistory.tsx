import { IErrorObject } from '@impler/shared';
import { useQuery } from '@tanstack/react-query';
import { API_KEYS } from '@config';
import { transactionApi } from 'subos-frontend';
import { useAppState } from 'store/app.context';

export function useTransactionHistory(page = 1, limit = 10) {
  const { profileInfo } = useAppState();
  const { getTransactions } = transactionApi;

  const {
    data: transactions,
    refetch: refetchTransactions,
    isLoading: isTransactionsLoading,
    isFetched: isTransactionsFetched,
  } = useQuery<any, IErrorObject, ITransactionHistory[], [string, number, number]>(
    [API_KEYS.TRANSACTION_HISTORY, page, limit],
    () => getTransactions(profileInfo!.email, { page, limit }),
    {
      enabled: !!profileInfo,
      select: (data) => data?.data || data,
    }
  );

  return {
    transactions,
    refetchTransactions,
    isTransactionsLoading,
    isTransactionsFetched,
  };
}
