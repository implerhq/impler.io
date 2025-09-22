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
  Button,
  Loader,
  Center,
} from '@mantine/core';
import { Alert } from '@ui/Alert';
import { IHistoryRecord } from '@impler/shared';
import { getStatusColor, getStatusSymbol } from '@shared/utils';
import { InformationIcon } from '@assets/icons/Information.icon';
import { useWebhookLogs } from '@hooks/useWebhookLogs';
import dayjs from 'dayjs';
import { DATE_FORMATS, VARIABLES } from '@config';
import { CopyIcon } from '@assets/icons/Copy.icon';

interface WebhookLog {
  _id?: string;
  status: string;
  callDate?: string;
  failedReason?: string;
  error?: string | object;
  dataContent?: string | object;
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

interface WebhookLogsTabProps {
  record: IHistoryRecord;
  webhookLogsData?: UseWebhookLogsReturn;
}

export function WebhookLogsTab({ record, webhookLogsData }: WebhookLogsTabProps) {
  const internalWebhookLogsData = useWebhookLogs({
    uploadId: record._id,
    limit: VARIABLES.TEN,
    enabled: !webhookLogsData && !!record._id,
  });

  // Use provided data or internal data
  const { webhookLogs, hasNextPage, isFetchingNextPage, fetchNextPage, loading } =
    webhookLogsData || internalWebhookLogsData;

  const isUsingApiData = webhookLogs.length > 0;

  return (
    <Stack>
      <Group>
        <Text size="lg" fw={600}>
          Webhook Response Logs
        </Text>
      </Group>

      {webhookLogs.length > 0 ? (
        <ScrollArea>
          <Timeline active={webhookLogs.length} bulletSize={24} lineWidth={2}>
            {webhookLogs.map((log: WebhookLog, index: number) => (
              <Timeline.Item
                key={log._id || index}
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
                          <Accordion.Control>
                            <Flex justify="space-between" align="center">
                              <Text>Error Details</Text>
                              <CopyButton
                                value={
                                  typeof log.error === 'object' ? JSON.stringify(log.error, null, 2) : log.error || ''
                                }
                              >
                                {({ copied, copy }) => (
                                  <Tooltip label={copied ? 'Copied' : 'Copy error details'}>
                                    <ActionIcon
                                      variant="subtle"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copy();
                                      }}
                                    >
                                      <CopyIcon size="xs" />
                                    </ActionIcon>
                                  </Tooltip>
                                )}
                              </CopyButton>
                            </Flex>
                          </Accordion.Control>
                          <Accordion.Panel>
                            <Code block c="white" p="xs">
                              {typeof log.error === 'object' ? JSON.stringify(log.error, null, 2) : log.error}
                            </Code>
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion>
                    </Box>
                  )}
                </Paper>
              </Timeline.Item>
            ))}
          </Timeline>

          {/* Show load more button only when using API data */}
          {isUsingApiData && hasNextPage && (
            <Center mt="md">
              {isFetchingNextPage || loading ? (
                <Loader size="sm" />
              ) : (
                <Button variant="subtle" onClick={() => fetchNextPage()}>
                  Load More Logs
                </Button>
              )}
            </Center>
          )}
        </ScrollArea>
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
