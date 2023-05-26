import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedState, useLocalStorage } from '@mantine/hooks';

import { commonApi } from '@libs/api';
import { API_KEYS, CONSTANTS, VARIABLES } from '@config';
import { IErrorObject, IHistoryData } from '@impler/shared';

export function useHistory() {
  const [limit, setLimit] = useState<number>();
  const [page, setPage] = useState<number>();
  const [name, setName] = useDebouncedState('', VARIABLES.TWO_HUNDREDS);
  const [profile] = useLocalStorage<IProfileData>({ key: CONSTANTS.PROFILE_STORAGE_NAME });
  const {
    refetch: fetchHistoryData,
    isLoading: isHistoryDataLoading,
    data: historyData,
  } = useQuery<unknown, IErrorObject, IHistoryData, (string | number | undefined)[]>(
    [API_KEYS.IMPORTS_LIST, limit, page, name],
    () =>
      commonApi<IHistoryData>(API_KEYS.IMPORTS_LIST as any, {
        parameters: [profile._projectId!],
        query: {
          limit,
          page,
          name,
        },
      }),
    {
      enabled: false,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (profile?._projectId) {
      fetchHistoryData();
    }
  }, [profile?._projectId, fetchHistoryData, page, limit, name]);

  return {
    onNameChange: setName,
    onPageChange: setPage,
    onLimitChange: setLimit,
    isHistoryDataLoading,
    historyData,
    name,
  };
}
