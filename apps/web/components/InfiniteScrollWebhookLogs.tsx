import React, { useEffect, useRef } from 'react';
import { Box, Text, Loader, Stack, Paper, Badge, Group } from '@mantine/core';
import { useHistory } from '@hooks/useHistory';

interface InfiniteScrollWebhookLogsProps {
  uploadId: string;
  isRetry?: boolean;
}

export function InfiniteScrollWebhookLogs({ uploadId, isRetry }: InfiniteScrollWebhookLogsProps) {
  const {
    webhookLogs,
    isLoadingMoreWebhookLogs,
    hasMoreWebhookLogs,
    totalWebhookLogs,
    initializeWebhookLogs,
    loadMoreWebhookLogs,
    resetWebhookLogs,
    createInfiniteScrollRef,
  } = useHistory();

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Initialize webhook logs when component mounts or uploadId changes
  useEffect(() => {
    if (uploadId) {
      resetWebhookLogs();
      initializeWebhookLogs(uploadId, isRetry);
    }
  }, [uploadId, isRetry, resetWebhookLogs, initializeWebhookLogs]);

  // Create the infinite scroll callback
  const handleLoadMore = () => {
    if (uploadId) {
      loadMoreWebhookLogs(uploadId, isRetry);
    }
  };

  // Get the intersection observer ref
  const infiniteScrollRef = createInfiniteScrollRef(handleLoadMore, hasMoreWebhookLogs, isLoadingMoreWebhookLogs);

  // Set up the intersection observer on the load more element
  useEffect(() => {
    if (loadMoreRef.current && infiniteScrollRef) {
      const cleanup = infiniteScrollRef(loadMoreRef.current);

      return cleanup;
    }
  }, [infiniteScrollRef, hasMoreWebhookLogs, isLoadingMoreWebhookLogs]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'green';
      case 'failed':
      case 'error':
        return 'red';
      case 'pending':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      <Group position="apart" mb="md">
        <Text size="lg" weight={600}>
          Webhook Logs {isRetry ? '(Retry)' : ''}
        </Text>
        <Text size="sm" color="dimmed">
          Total: {totalWebhookLogs} logs
        </Text>
      </Group>

      <Stack spacing="sm" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {webhookLogs.length === 0 && !isLoadingMoreWebhookLogs ? (
          <Text color="dimmed" ta="center" py="xl">
            No webhook logs found
          </Text>
        ) : (
          <>
            {webhookLogs.map((log) => (
              <Paper key={log._id} p="md" withBorder>
                <Group position="apart" mb="xs">
                  <Badge color={getStatusColor(log.status)} variant="light">
                    {log.status}
                  </Badge>
                  <Text size="xs" color="dimmed">
                    {formatDate(log.callDate)}
                  </Text>
                </Group>

                {log.failedReason && (
                  <Text size="sm" color="red" mb="xs">
                    <strong>Failed Reason:</strong> {log.failedReason}
                  </Text>
                )}

                {log.error && (
                  <Text size="sm" color="red" mb="xs">
                    <strong>Error:</strong> {typeof log.error === 'string' ? log.error : JSON.stringify(log.error)}
                  </Text>
                )}

                {log.dataContent && (
                  <Text size="sm" color="dimmed">
                    <strong>Data:</strong>{' '}
                    {typeof log.dataContent === 'string'
                      ? log.dataContent.substring(0, 100) + '...'
                      : JSON.stringify(log.dataContent).substring(0, 100) + '...'}
                  </Text>
                )}
              </Paper>
            ))}

            {/* Infinite scroll trigger element */}
            {hasMoreWebhookLogs && (
              <div ref={loadMoreRef} style={{ height: '20px', margin: '10px 0' }}>
                {isLoadingMoreWebhookLogs && (
                  <Group position="center">
                    <Loader size="sm" />
                    <Text size="sm" color="dimmed">
                      Loading more logs...
                    </Text>
                  </Group>
                )}
              </div>
            )}

            {!hasMoreWebhookLogs && webhookLogs.length > 0 && (
              <Text size="sm" color="dimmed" ta="center" py="md">
                No more logs to load
              </Text>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
}

/*
 * Usage example:
 * <InfiniteScrollWebhookLogs uploadId="your-upload-id" isRetry={false} />
 */
