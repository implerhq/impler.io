import { API_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';
import { commonApi } from '@libs/api';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export function useImportCount() {
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);

  const { isFetching: isImportCountLoading, data: importCountData } = useQuery<
    unknown,
    IErrorObject,
    IImportCountData[],
    (string | number | null | Date)[]
  >(
    [API_KEYS.IMPORT_COUNT, dates[0], dates[1]],
    () =>
      commonApi<IImportCountData[]>(API_KEYS.IMPORT_COUNT as any, {
        query: {
          start: dates[0] ? dates[0].toISOString().split('T')[0] : undefined,
          end: dates[1] ? dates[1].toISOString().split('T')[0] : undefined,
        },
      }),
    {
      keepPreviousData: true,
      enabled: !!dates[0] || !!dates[1],
    }
  );

  useEffect(() => {
    const todayDate = new Date();
    todayDate.setDate(1);
    const endOfMonthDate = new Date();
    endOfMonthDate.setMonth(endOfMonthDate.getMonth() + 1);
    setDates([todayDate, endOfMonthDate]);
  }, []);

  return {
    dates,
    setDates,
    isImportCountLoading,
    importCountData,
  };
}
