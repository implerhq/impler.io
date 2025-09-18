import React, { useState } from 'react';
import { Tabs, Group, Box } from '@mantine/core';

import { IHistoryRecord, ImportJobHistoryStatusEnum } from '@impler/shared';
import { OverviewTab } from './OverviewTab';
import { WebhookLogsTab } from './WebhookLogsTab';
import { RetryTab } from './RetryTab';
import { modals } from '@mantine/modals';
import { MODAL_KEYS } from '@config';
import { Button } from '@ui/button';
import { useHistory } from '@hooks/useHistory';

interface ImportHistoryModalProps {
  record: IHistoryRecord;
  onDownloadFile: (data: [string, string]) => void;
  onRetry: (uploadId: string) => void;
  isRetryLoading: boolean;
}

export function ImportHistoryModal({ record, onDownloadFile, isRetryLoading }: ImportHistoryModalProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const { currentRecord, refreshLogs, handleRetry } = useHistory(record._id);

  const displayRecord = currentRecord || record;

  // Check if there are webhook logs available
  const hasWebhookLogs = displayRecord.webhookLogs?.length > 0 || false;

  const handleDownloadFile = () => {
    onDownloadFile([record._id, record.originalFileName]);
  };

  const handleTabChange = (value: string | null) => {
    setActiveTab(value || 'overview');
    if (value === 'logs' && refreshLogs) {
      refreshLogs();
    }
  };

  const handleRetryClick = () => {
    handleRetry(record._id);
  };

  const canRetry =
    displayRecord.webhookLogs?.length > 0 &&
    (displayRecord.status === ImportJobHistoryStatusEnum.PROCESSING ||
      displayRecord.status === ImportJobHistoryStatusEnum.COMPLETED);

  return (
    <Box style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
      <Tabs
        value={activeTab}
        onTabChange={handleTabChange}
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <Box style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--mantine-color-body)' }}>
          <Tabs.List grow mb="md">
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="logs">Webhook Logs</Tabs.Tab>
            {hasWebhookLogs && <Tabs.Tab value="retry">Retry History</Tabs.Tab>}
          </Tabs.List>
        </Box>

        <Box style={{ flex: 1, overflow: 'auto', paddingBottom: '1rem' }}>
          <Tabs.Panel value="overview">
            <OverviewTab record={displayRecord} />
          </Tabs.Panel>

          <Tabs.Panel value="logs">
            <WebhookLogsTab record={displayRecord} />
          </Tabs.Panel>

          {hasWebhookLogs && (
            <Tabs.Panel value="retry">
              <RetryTab record={displayRecord} />
            </Tabs.Panel>
          )}
        </Box>
      </Tabs>

      <Group position="center">
        <Button variant="outline" onClick={() => modals.close(MODAL_KEYS.VIEW_IMPORT_HISTORY)}>
          Close
        </Button>
        <Button onClick={handleDownloadFile}>Download Original File</Button>
        {canRetry && record.originalFileName && record._uploadedFileId ? (
          <Button onClick={handleRetryClick} loading={isRetryLoading}>
            Retry Import
          </Button>
        ) : null}
      </Group>
    </Box>
  );
}
