/* eslint-disable multiline-comment-style */
import React from 'react';
import {
  Stack,
  Group,
  Text,
  Accordion,
  ActionIcon,
  Badge,
  Box,
  Code,
  CopyButton,
  Flex,
  Paper,
  ScrollArea,
  Timeline,
  Tooltip,
} from '@mantine/core';
import { Alert } from '@ui/Alert';
import { InformationIcon } from '@assets/icons/Information.icon';
import { getStatusSymbol, getStatusColor, formatDate, renderJSONContent } from '@shared/utils';
import { IHistoryRecord } from '@impler/shared';

export function WebhookLogsTab({ record }: { record: IHistoryRecord }) {
  // if (loading) {
  //   return (
  //     <Center style={{ height: 200 }}>
  //       <Loader size="md" />
  //     </Center>
  //   );
  // }

  // if (error) {
  //   return (
  //     <Alert color="red" variant="light">
  //       <Text size="sm">Error loading webhook logs: {error}</Text>
  //     </Alert>
  //   );
  // }

  return (
    <Stack style={{ height: '100%' }}>
      <Group>
        <Text size="lg" fw={600}>
          Webhook Response Logs
        </Text>
      </Group>

      {record.webhookLogs?.length > 0 ? (
        <Timeline active={record.webhookLogs?.length || 0} bulletSize={24} lineWidth={2}>
          {record.webhookLogs?.map((log, index: number) => (
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
        <Alert variant="light" color="yellow">
          <Group spacing="xs">
            <InformationIcon size="sm" />
            <Text size="xs">No webhook logs available for this import.</Text>
          </Group>
        </Alert>
      )}
    </Stack>
  );
}
