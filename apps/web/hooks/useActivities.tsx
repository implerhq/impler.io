import { useEffect } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { track } from '@libs/amplitude';
import { API_KEYS, CONSTANTS } from '@config';
import { IErrorObject, ISummaryData } from '@impler/shared';

export function useSummary() {
  const [profile] = useLocalStorage<IProfileData>({ key: CONSTANTS.PROFILE_STORAGE_NAME });
  const {
    data: summaryData,
    refetch: fetchSummaryData,
    isLoading: isSummaryLoading,
  } = useQuery<unknown, IErrorObject, ISummaryData, string[]>(
    [API_KEYS.IMPORT_SUMMARY],
    () =>
      commonApi<ISummaryData>(API_KEYS.IMPORT_SUMMARY as any, {
        parameters: [profile._projectId!],
      }),
    {
      enabled: false,
      onSuccess: () => {
        track({
          name: 'VIEW SUMMARY',
          properties: {},
        });
      },
    }
  );

  useEffect(() => {
    if (profile?._projectId) {
      fetchSummaryData();
    }
  }, [profile?._projectId, fetchSummaryData]);

  return {
    summaryData,
    isSummaryLoading,
  };
}
