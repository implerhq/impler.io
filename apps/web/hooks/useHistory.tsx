import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebouncedState } from '@mantine/hooks';

import { commonApi } from '@libs/api';
import { track } from '@libs/amplitude';
import { API_KEYS, MODAL_KEYS, VARIABLES } from '@config';
import { useAppState } from 'store/app.context';
import { IErrorObject, IPaginationData, IHistoryRecord, downloadFile } from '@impler/shared';
import { modals } from '@mantine/modals';
import { ImportHistoryModal } from '@components/import-feed/ImportHistoryModal/ImportHistoryModal';
import { Title } from '@mantine/core';

export function useHistory(recordId?: string) {
  const { profileInfo } = useAppState();
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date>();
  const [page, setPage] = useState<number>();
  const [limit, setLimit] = useState<number>(VARIABLES.TEN);
  const [name, setName] = useDebouncedState('', VARIABLES.TWO_HUNDREDS);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Main history data query
  const { isFetching: isHistoryDataLoading, data: historyData } = useQuery<
    unknown,
    IErrorObject,
    IPaginationData<IHistoryRecord>,
    (string | number | undefined | Date)[]
  >(
    [API_KEYS.ACTIVITY_HISTORY, profileInfo?._projectId, limit, page, name, date],
    () =>
      commonApi<IPaginationData<IHistoryRecord>>(API_KEYS.ACTIVITY_HISTORY as any, {
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

  // Live data query for real-time updates (from useRetryLogs)
  const { data: liveData, refetch: refetchLiveData } = useQuery<
    unknown,
    IErrorObject,
    IPaginationData<IHistoryRecord>,
    (string | number | undefined)[]
  >(
    [API_KEYS.ACTIVITY_HISTORY, 'live', profileInfo?._projectId, recordId, refreshTrigger],
    () =>
      commonApi<IPaginationData<IHistoryRecord>>(API_KEYS.ACTIVITY_HISTORY as any, {
        parameters: [profileInfo!._projectId],
        query: { limit: 100, page: 1 },
      }),
    {
      enabled: !!profileInfo && !!recordId,
      refetchInterval: 3000,
    }
  );

  // Download original file mutation
  const { isLoading: isDownloadOriginalFileLoading, mutate: downloadOriginalFile } = useMutation<
    ArrayBuffer,
    IErrorObject,
    [string, string]
  >(
    ['downloadOriginal'],
    ([uploadId]) => commonApi(API_KEYS.DONWLOAD_ORIGINAL_FILE as any, { parameters: [uploadId] }),
    {
      onSuccess(excelFileData, variables) {
        downloadFile(new Blob([excelFileData]), variables[1]);
      },
    }
  );

  // Retry import mutation (enhanced from both hooks)
  const {
    isLoading: isRetryLoading,
    mutate: retryImport,
    data: retryImportData,
  } = useMutation<void, IErrorObject, string>(
    ['retryImport'],
    (uploadId) => commonApi(API_KEYS.ACTIVITY_RETRY as any, { parameters: [uploadId] }),
    {
      onSuccess() {
        queryClient.invalidateQueries([API_KEYS.ACTIVITY_HISTORY, profileInfo?._projectId]);
        // Also refresh live data if we have a recordId
        if (recordId) {
          refreshLogs();
        }
      },
      onError() {},
    }
  );

  // Helper functions from useRetryLogs
  const getCurrentRecord = (): IHistoryRecord | undefined => {
    if (!recordId || !liveData?.data) return undefined;

    return liveData.data.find((record) => record._id === recordId);
  };

  const refreshLogs = () => {
    setRefreshTrigger((prev) => prev + 1);
    queryClient.invalidateQueries([API_KEYS.ACTIVITY_HISTORY, profileInfo?._projectId]);
    refetchLiveData();
  };

  // Enhanced handleRetry that works with both mutation patterns
  const handleRetry = (uploadId: string) => {
    retryImport(uploadId);
  };

  // Filter and state management functions
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

  function openViewImportHistoryModal(record: IHistoryRecord) {
    modals.open({
      modalId: MODAL_KEYS.VIEW_IMPORT_HISTORY,
      centered: true,
      size: 'calc(40vw - 3rem)',
      children: (
        <ImportHistoryModal
          record={record}
          onDownloadFile={downloadOriginalFile}
          onRetry={retryImport}
          isRetryLoading={isRetryLoading}
        />
      ),
      withCloseButton: true,
      title: <Title order={3}>Import Details</Title>,
    });
  }

  return {
    // Original useHistory returns
    onDateChange,
    onNameChange,
    onPageChange: setPage,
    onLimitChange,
    downloadOriginalFile,
    retryImport,
    isHistoryDataLoading,
    isDownloadOriginalFileLoading,
    isRetryLoading,
    historyData,
    retryImportData,
    openViewImportHistoryModal,
    name,
    date,

    // New returns from useRetryLogs
    currentRecord: getCurrentRecord(),
    refreshLogs,
    handleRetry,
    liveData,
  };
}
