import { useState } from 'react';
import { commonApi } from '@libs/api';
import { IErrorObject, IPaginationData } from '@impler/shared';
import { useQuery } from '@tanstack/react-query';
import { API_KEYS, VARIABLES } from '@config';

export function useTransactionHistory() {
  const [page, setPage] = useState<number>();
  const [limit, setLimit] = useState<number>(VARIABLES.TEN);
  const {
    data: transactions,
    refetch: refetchTransactions,
    isLoading: isTransactionsLoading,
    isFetched: isTransactionsFetched,
  } = useQuery<unknown, IErrorObject, IPaginationData<ITransactionHistory>, [string, number, number | undefined]>(
    [API_KEYS.TRANSACTION_HISTORY, limit, page],
    () =>
      commonApi<IPaginationData<ITransactionHistory[]>>(API_KEYS.TRANSACTION_HISTORY as any, {
        query: {
          limit,
          page,
        },
      })
  );

  function onLimitChange(newLimit: number) {
    setLimit(newLimit);
  }

  return {
    transactions,
    refetchTransactions,
    isTransactionsLoading,
    isTransactionsFetched,
    onLimitChange,
    onPageChange: setPage,
  };
}
