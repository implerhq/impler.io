import { useState, useEffect } from 'react';

interface UseWebhookLogsParams {
  uploadId: string;
  page?: number;
  limit?: number;
  isRetry?: boolean;
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

interface UseWebhookLogsReturn {
  webhookLogs: WebhookLog[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalRecords: number;
}

export function useWebhookLogs({
  uploadId,
  page = 1,
  limit = 10,
  isRetry = false,
}: UseWebhookLogsParams): UseWebhookLogsReturn {
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchWebhookLogs = async () => {
      if (!uploadId) return;

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (isRetry) {
          params.append('isRetry', 'true');
        }

        const response = await fetch(`/api/v1/activity/upload/${uploadId}/webhook-logs?${params}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          setWebhookLogs(data.data || []);
          setTotalPages(data.totalPages || 0);
          setTotalRecords(data.totalRecords || 0);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch webhook logs');
        setWebhookLogs([]);
        setTotalPages(0);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    };

    fetchWebhookLogs();
  }, [uploadId, page, limit, isRetry]);

  return {
    webhookLogs,
    loading,
    error,
    totalPages,
    totalRecords,
  };
}
