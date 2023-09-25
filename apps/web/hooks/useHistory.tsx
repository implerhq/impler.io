import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedState } from '@mantine/hooks';

import { commonApi } from '@libs/api';
import { track } from '@libs/amplitude';
import { API_KEYS, VARIABLES } from '@config';
import { IErrorObject, IHistoryData } from '@impler/shared';
import { useAppState } from 'store/app.context';

export function useHistory() {
  const { profileInfo } = useAppState();
  const [date, setDate] = useState<Date>();
  const [limit, setLimit] = useState<number>(VARIABLES.TEN);
  const [page, setPage] = useState<number>();
  const [name, setName] = useDebouncedState('', VARIABLES.TWO_HUNDREDS);
  const { isLoading: isHistoryDataLoading, data: historyData } = useQuery<
    unknown,
    IErrorObject,
    IHistoryData,
    (string | number | undefined | Date)[]
  >(
    [API_KEYS.IMPORTS_LIST, limit, page, name, date],
    () =>
      commonApi<IHistoryData>(API_KEYS.IMPORTS_LIST as any, {
        parameters: [profileInfo!._projectId],
        query: {
          limit,
          page,
          name,
          date: date?.toLocaleDateString('en-US'),
        },
      }),
    {
      enabled: !!profileInfo,
      keepPreviousData: true,
    }
  );

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
