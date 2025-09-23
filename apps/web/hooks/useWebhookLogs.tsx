import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { commonApi } from '@libs/api';
import { API_KEYS } from '@config';
import { IErrorObject, IPaginationData } from '@impler/shared';

interface UseWebhookLogsParams {
  uploadId: string;
  limit?: number;
  isRetry?: boolean;
  enabled?: boolean;
  // Add debug delay parameter
  debugDelay?: number;
}

interface WebhookLog {
  _id: string;
  uploadId: string;
  status: string;
  callDate: string;
  failedReason?: string;
  error?: string | object;
  dataContent?: string | object;
  isRetry?: boolean;
}

type WebhookLogsResponse = IPaginationData<WebhookLog>;

interface UseWebhookLogsReturn {
  webhookLogs: WebhookLog[];
  loading: boolean;
  error: IErrorObject | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  totalRecords: number;
  refetch: () => void;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useWebhookLogs({
  uploadId,
  limit = 10,
  isRetry = false,
  enabled = true,
  debugDelay = 1000,
}: UseWebhookLogsParams): UseWebhookLogsReturn {
  const { data, error, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery<
    WebhookLogsResponse,
    IErrorObject
  >(
    [API_KEYS.ACTIVITY_WEBHOOK_LOGS, uploadId, limit, isRetry, debugDelay],
    async ({ pageParam = 1 }) => {
      if (debugDelay > 0) {
        await delay(debugDelay);
      }

      return commonApi<WebhookLogsResponse>(API_KEYS.ACTIVITY_WEBHOOK_LOGS as any, {
        parameters: [uploadId],
        query: {
          page: pageParam,
          limit,
          ...(isRetry && { isRetry: 'true' }),
        },
      });
    },
    {
      enabled: enabled && !!uploadId,
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = allPages.length;
        const totalPages = Math.ceil((lastPage.totalRecords || 0) / limit);

        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      refetchOnWindowFocus: false,
      staleTime: 30000,
    }
  );

  const webhookLogs = useMemo(() => {
    return data?.pages.flatMap((page) => page.data || []) || [];
  }, [data]);

  const totalRecords = useMemo(() => {
    return data?.pages[0]?.totalRecords || 0;
  }, [data]);

  return {
    webhookLogs,
    loading: isLoading,
    error,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    totalRecords,
    refetch,
  };
}
