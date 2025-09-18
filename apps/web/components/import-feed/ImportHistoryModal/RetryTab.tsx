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
  Card,
  ThemeIcon,
} from '@mantine/core';
import { Alert } from '@ui/Alert';
import { IHistoryRecord } from '@impler/shared';
import { formatDate, getStatusColor, getStatusSymbol, renderJSONContent } from '@shared/utils';
import { InformationIcon } from '@assets/icons/Information.icon';
// import { RedoIcon } from '@assets/icons/Redo.icon';

interface WebhookLog {
  status: string;
  callDate?: string;
  failedReason?: string;
  error?: string | object;
  dataContent?: string | object;
  isRetry?: boolean;
}

interface RetryTabProps {
  record: IHistoryRecord;
}

export function RetryTab({ record }: RetryTabProps) {
  console.log('RECORD', record);
  const webhookLogs = (record as any).webhookLogs || [];
  const retryLogs = webhookLogs.filter((log: WebhookLog) => log.isRetry === true);
  const hasRetryLogs = retryLogs.length > 0;

  return (
    <Stack style={{ height: '100%' }}>
      <Group>
        <Text size="lg" fw={600}>
          Retry History
        </Text>
        <Badge variant="light" color={hasRetryLogs ? 'blue' : 'gray'} size="sm">
          {retryLogs.length} Retry{retryLogs.length !== 1 ? 'ies' : ''}
        </Badge>
      </Group>

      {hasRetryLogs ? (
        <>
          {/* Retry Summary Card */}
          <Card withBorder radius="md" p="lg">
            <Group position="apart" mb="md">
              <Text size="sm">Retry Summary</Text>
              <ThemeIcon variant="light" size="lg" color="blue">
                {/* <RefreshIcon /> */}
                <Text size="xs">hELLO</Text>
              </ThemeIcon>
            </Group>

            <Group spacing="xl">
              <Box>
                <Text size="xs" c="dimmed" mb={4}>
                  Total Retries
                </Text>
                <Text size="lg" fw={700} c="blue">
                  {retryLogs.length}
                </Text>
              </Box>

              <Box>
                <Text size="xs" c="dimmed" mb={4}>
                  Successful Retries
                </Text>
                <Text size="lg" fw={700} c="green">
                  {retryLogs.filter((log: WebhookLog) => log.status === 'Success').length}
                </Text>
              </Box>

              <Box>
                <Text size="xs" c="dimmed" mb={4}>
                  Failed Retries
                </Text>
                <Text size="lg" fw={700} c="red">
                  {retryLogs.filter((log: WebhookLog) => log.status === 'Failed').length}
                </Text>
              </Box>
            </Group>
          </Card>

          {/* Retry Timeline */}
          <ScrollArea style={{ flex: 1, maxHeight: '100%' }} scrollbarSize={6}>
            <Timeline active={retryLogs.length} bulletSize={24} lineWidth={2}>
              {retryLogs.map((log: WebhookLog, index: number) => (
                <Timeline.Item
                  key={index}
                  bullet={<Text size="sm">{getStatusSymbol(log.status)}</Text>}
                  title={`Retry Attempt #${index + 1}`}
                  color={getStatusColor(log.status)}
                >
                  <Paper withBorder p="md" mt="xs" radius="sm">
                    <Group position="apart" mb="sm">
                      <Group spacing="xs">
                        <Badge variant="light" color={getStatusColor(log.status)}>
                          {getStatusSymbol(log.status)} {log.status}
                        </Badge>
                        <Badge variant="outline" color="blue" size="xs">
                          RETRY
                        </Badge>
                      </Group>
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
                          <Accordion.Item value={`errorDetails-${index}`}>
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
                            Retry Data Content
                          </Text>
                          <CopyButton value={renderJSONContent(log.dataContent)}>
                            {({ copied, copy }) => (
                              <Tooltip label={copied ? 'Copied' : 'Copy retry data'}>
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
          </ScrollArea>
        </>
      ) : (
        <Alert variant="light" color="blue">
          <Group spacing="xs">
            <InformationIcon size="sm" />
            <Text size="xs">No retry attempts have been made for this import.</Text>
          </Group>
        </Alert>
      )}
    </Stack>
  );
}
