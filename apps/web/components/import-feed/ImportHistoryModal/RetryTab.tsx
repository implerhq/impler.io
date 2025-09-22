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
} from '@mantine/core';
import { Alert } from '@ui/Alert';
import { IHistoryRecord } from '@impler/shared';
import { getStatusColor, getStatusSymbol, renderJSONContent } from '@shared/utils';
import { InformationIcon } from '@assets/icons/Information.icon';
import dayjs from 'dayjs';
import { DATE_FORMATS } from '@config';
import { CopyIcon } from '@assets/icons/Copy.icon';

interface WebhookLog {
  status: string;
  callDate?: string;
  failedReason?: string;
  error?: string | object;
  dataContent?: string | object;
  isRetry?: boolean;
}

interface UseWebhookLogsReturn {
  webhookLogs: WebhookLog[];
  loading: boolean;
  error: any;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  totalRecords: number;
  refetch: () => void;
}

interface RetryTabProps {
  record: IHistoryRecord;
  webhookLogsData?: UseWebhookLogsReturn;
}

export function RetryTab({ record, webhookLogsData }: RetryTabProps) {
  const allWebhookLogs =
    webhookLogsData!.webhookLogs!.length > 0
      ? webhookLogsData!.webhookLogs!
      : (record as IHistoryRecord & { webhookLogs?: WebhookLog[] }).webhookLogs || [];

  const retryLogs = allWebhookLogs?.filter((log: WebhookLog) => log.isRetry === true);
  const hasRetryLogs = retryLogs!.length > 0;

  return (
    <Stack>
      <Group>
        <Text size="lg" fw={600}>
          Retry History
        </Text>
        <Badge variant="light" color={hasRetryLogs ? 'blue' : 'gray'} size="sm">
          {retryLogs?.length} Retry{retryLogs?.length !== 1 ? 'ies' : ''}
        </Badge>
      </Group>

      {hasRetryLogs ? (
        <>
          <Card withBorder radius="md" p="lg">
            <Group position="apart" mb="md">
              <Text size="sm">Retry Summary</Text>
            </Group>

            <Group spacing="xl">
              <Box>
                <Text size="xs" c="dimmed" mb={4}>
                  Total Retries
                </Text>
                <Text size="lg" fw={700} c="blue">
                  {retryLogs?.length}
                </Text>
              </Box>

              <Box>
                <Text size="xs" c="dimmed" mb={4}>
                  Successful Retries
                </Text>
                <Text size="lg" fw={700} c="green">
                  {retryLogs?.filter((log: WebhookLog) => log.status === 'Success').length}
                </Text>
              </Box>

              <Box>
                <Text size="xs" c="dimmed" mb={4}>
                  Failed Retries
                </Text>
                <Text size="lg" fw={700} c="red">
                  {retryLogs?.filter((log: WebhookLog) => log.status === 'Failed').length}
                </Text>
              </Box>
            </Group>
          </Card>

          <ScrollArea style={{ flex: 1, maxHeight: '100%' }} scrollbarSize={6}>
            <Timeline active={retryLogs?.length} bulletSize={24} lineWidth={2}>
              {retryLogs?.map((log: WebhookLog, index: number) => (
                <Timeline.Item
                  key={index}
                  bullet={<Text size="sm">{getStatusSymbol(log.status)}</Text>}
                  title={`Retry Attempt #${retryLogs?.length - index}`}
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
                          {dayjs(log.callDate).format(DATE_FORMATS.LONG)}
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
                          <CopyButton
                            value={typeof log.error === 'object' ? JSON.stringify(log.error, null, 2) : log.error || ''}
                          >
                            {({ copied, copy }) => (
                              <Tooltip label={copied ? 'Copied' : 'Copy error details'}>
                                <ActionIcon variant="subtle" size="sm" onClick={copy}>
                                  <CopyIcon size="xs" />
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
