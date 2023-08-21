import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedState, useLocalStorage } from '@mantine/hooks';

import { commonApi } from '@libs/api';
import { track } from '@libs/amplitude';
import { API_KEYS, CONSTANTS, VARIABLES } from '@config';
import { IErrorObject, IHistoryData } from '@impler/shared';

export function useHistory() {
  const [date, setDate] = useState<Date>();
  const [limit, setLimit] = useState<number>(VARIABLES.TEN);
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
          date: date?.toLocaleDateString('en-US'),
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
  }, [profile?._projectId, fetchHistoryData, page, limit, name, date]);

  function onDateChange(newDate?: Date) {
    setDate(newDate);
    if (newDate) {
      track({
        name: 'HISTORY FILTER',
        properties: {
          date: newDate.toLocaleDateString('en-US'),
        },
      });
    }
  }
  function onLimitChange(newLimit: number) {
    setLimit(newLimit);
    track({
      name: 'HISTORY FILTER',
      properties: {
        limit: newLimit,
      },
    });
  }
  function onNameChange(newName: string) {
    setName(newName);
    if (newName) {
      track({
        name: 'HISTORY FILTER',
        properties: {
          text: newName,
        },
      });
    }
  }

  return {
    onDateChange,
    onNameChange,
    onPageChange: setPage,
    onLimitChange,
    isHistoryDataLoading,
    historyData,
    name,
    date,
  };
}
