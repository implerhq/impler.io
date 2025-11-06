import { IErrorObject } from '@impler/shared';
import { useQuery } from '@tanstack/react-query';
import { API_KEYS } from '@config';
import { useSubOSIntegration } from './useSubOSIntegration';

export function useTransactionHistory(page = 1, limit = 10) {
  const { fetchTransactions, isConfigured } = useSubOSIntegration();

  const {
    data: transactions,
    refetch: refetchTransactions,
    isLoading: isTransactionsLoading,
    isFetched: isTransactionsFetched,
  } = useQuery<any, IErrorObject, ITransactionHistory[], [string, number, number]>(
    [API_KEYS.TRANSACTION_HISTORY, page, limit],
    () => fetchTransactions(page, limit),
    {
      enabled: isConfigured,
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
