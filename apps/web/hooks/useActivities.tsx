import { API_KEYS, CONSTANTS } from '@config';
import { IErrorObject, ISummaryData } from '@impler/shared';
import { commonApi } from '@libs/api';
import { useLocalStorage } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useActivites() {
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
