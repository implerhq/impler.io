import React from 'react';
import {
  Stack,
  Group,
  Text,
  Timeline,
  Paper,
  Box,
  Badge,
  ScrollArea,
  Code,
  CopyButton,
  Tooltip,
  ActionIcon,
  Flex,
  Accordion,
} from '@mantine/core';
import { Alert } from '@ui/Alert';
import { IHistoryRecord } from '@impler/shared';
import { formatDate, getStatusColor, getStatusSymbol, renderJSONContent } from '@shared/utils';
import { InformationIcon } from '@assets/icons/Information.icon';

interface WebhookLog {
  status: string;
  callDate?: string;
  failedReason?: string;
  error?: string | object;
  dataContent?: string | object;
}

export function WebhookLogsTab({ record }: { record: IHistoryRecord }) {
  const webhookLogs = (record as any).webhookLogs || [];

  return (
    <Stack>
      <Group>
        <Text size="lg" fw={600}>
          Webhook Response Logs
        </Text>
      </Group>

      {webhookLogs.length > 0 ? (
        <Timeline active={webhookLogs.length} bulletSize={24} lineWidth={2}>
          {webhookLogs.map((log: WebhookLog, index: number) => (
            <Timeline.Item
              key={index}
              bullet={<Text size="sm">{getStatusSymbol(log.status)}</Text>}
              title={`Webhook Call #${index + 1}`}
              color={getStatusColor(log.status)}
            >
              <Paper withBorder p="md" mt="xs" radius="sm">
                <Group position="apart" mb="sm">
                  <Badge variant="light" color={getStatusColor(log.status)}>
                    {getStatusSymbol(log.status)} {log.status}
                  </Badge>
                  {log.callDate && (
                    <Text size="xs" c="dimmed">
                      {formatDate(log.callDate)}
                    </Text>
                  )}
                </Group>

                {log.failedReason && (
                  <Alert color="red" variant="light" mb="sm">
                    <Text size="sm">❌ {log.failedReason}</Text>
                  </Alert>
                )}

                {log.error && (
                  <Box mb="sm">
                    <Accordion variant="contained">
                      <Accordion.Item value="errorDetails">
                        <Accordion.Control>Error Details</Accordion.Control>
                        <Accordion.Panel>
                          <Code block c="white" p="xs">
                            {typeof log.error === 'object' ? JSON.stringify(log.error, null, 2) : log.error}
                          </Code>
                        </Accordion.Panel>
                      </Accordion.Item>
                    </Accordion>
                  </Box>
                )}
                {log.dataContent && (
                  <Box>
                    <Flex justify="space-between" align="center" mb={4}>
                      <Text size="xs" c="dimmed">
                        Data Content
                      </Text>
                      <CopyButton value={renderJSONContent(log.dataContent)}>
                        {({ copied, copy }) => (
                          <Tooltip label={copied ? 'Copied' : 'Copy content'}>
                            <ActionIcon variant="subtle" size="sm" onClick={copy}>
                              <Text size="xs">{copied ? '✓' : '📋'}</Text>
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </CopyButton>
                    </Flex>
                    <ScrollArea style={{ maxHeight: 200 }}>
                      <Code block p="sm">
                        {renderJSONContent(log.dataContent)}
                      </Code>
                    </ScrollArea>
                  </Box>
                )}
              </Paper>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <Alert variant="light" color="blue">
          <Group spacing="xs">
            <InformationIcon size="sm" />
            <Text size="xs">No webhook logs available for this import.</Text>
          </Group>
        </Alert>
      )}
    </Stack>
  );
}
