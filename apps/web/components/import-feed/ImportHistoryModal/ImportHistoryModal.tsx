import React, { useState } from 'react';
import { Tabs, Group, Box } from '@mantine/core';
import { IHistoryRecord } from '@impler/shared';
import { OverviewTab } from './OverviewTab';
import { WebhookLogsTab } from './WebhookLogsTab';
import { Button } from '@ui/button';

interface ImportHistoryModalProps {
  onClose?: () => void;
  record: IHistoryRecord;
  onDownloadFile: (data: [string, string]) => void;
}

export function ImportHistoryModal({ onClose, record, onDownloadFile }: ImportHistoryModalProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const handleDownloadFile = () => {
    if (record.originalFileName && record._uploadedFileId) {
      onDownloadFile([record._id, record.originalFileName]);
    }
  };

  return (
    <Box style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
      <Tabs
        value={activeTab}
        onTabChange={(value) => setActiveTab(value || 'overview')}
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <Tabs.List grow mb="md">
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="logs">Webhook Logs</Tabs.Tab>
        </Tabs.List>

        <Box style={{ flexGrow: 1, overflow: 'auto', marginBottom: 'auto' }}>
          <Tabs.Panel value="overview">
            <OverviewTab record={record} />
          </Tabs.Panel>

          <Tabs.Panel value="logs">
            <WebhookLogsTab record={record as IHistoryRecord} />
          </Tabs.Panel>
        </Box>
      </Tabs>

      <Group position="center" pt="md">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        {record.originalFileName && record._uploadedFileId && (
          <Button onClick={handleDownloadFile}>Download Original File</Button>
        )}
      </Group>
    </Box>
  );
}
