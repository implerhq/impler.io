import React, { useState } from 'react';
import { Tabs, Box, Flex, Stack } from '@mantine/core';

import { IHistoryRecord, ImportJobHistoryStatusEnum } from '@impler/shared';
import { OverviewTab } from './OverviewTab';
import { WebhookLogsTab } from './WebhookLogsTab';
import { RetryTab } from './RetryTab';
import { Button } from '@ui/button';
import { useWebhookLogs } from '@hooks/useWebhookLogs';
import { VARIABLES } from '@config';

interface ImportHistoryModalProps {
  record: IHistoryRecord;
  onDownloadFile: (data: [string, string]) => void;
  onRetry: (uploadId: string) => void;
  isRetryLoading: boolean;
}

export function ImportHistoryModal({ record, onDownloadFile, onRetry, isRetryLoading }: ImportHistoryModalProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const webhookLogsData = useWebhookLogs({
    uploadId: record._id,
    limit: VARIABLES.TEN,
    enabled: !!record._id,
  });

  const handleDownloadFile = () => {
    onDownloadFile([record._id, record.originalFileName]);
  };

  const handleTabChange = (value: string | null) => {
    setActiveTab(value || 'overview');
  };

  const handleRetryClick = () => {
    onRetry(record._id);
  };

  const canRetry =
    webhookLogsData.webhookLogs.length > 0 &&
    (record.status === ImportJobHistoryStatusEnum.PROCESSING || record.status === ImportJobHistoryStatusEnum.COMPLETED);

  return (
    <Stack>
      <Tabs value={activeTab} onTabChange={handleTabChange}>
        <Tabs.List grow>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="logs">Webhook Logs</Tabs.Tab>
          <Tabs.Tab value="retry">Retry History</Tabs.Tab>
        </Tabs.List>

        <Box h="60vh" style={{ overflowY: 'auto' }} py="md">
          <Tabs.Panel value="overview" px="md">
            <OverviewTab record={record} />
          </Tabs.Panel>

          <Tabs.Panel value="logs" px="md">
            <WebhookLogsTab record={record} webhookLogsData={webhookLogsData} />
          </Tabs.Panel>

          <Tabs.Panel value="retry" px="md">
            <RetryTab record={record} webhookLogsData={webhookLogsData} />
          </Tabs.Panel>
        </Box>
      </Tabs>

      <Box mt="auto" pt="md">
        <Flex gap="lg" justify="center">
          <Button variant="outline" fullWidth onClick={handleDownloadFile}>
            Download Original File
          </Button>
          {canRetry && record.originalFileName && record._uploadedFileId ? (
            <Button fullWidth onClick={handleRetryClick} loading={isRetryLoading}>
              Retry Import
            </Button>
          ) : null}
        </Flex>
      </Box>
    </Stack>
  );
}
