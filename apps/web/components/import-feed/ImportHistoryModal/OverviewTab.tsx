import React from 'react';
import {
  Stack,
  Card,
  Group,
  Text,
  Badge,
  Grid,
  ThemeIcon,
  Timeline,
  Code,
  CopyButton,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import { IHistoryRecord } from '@impler/shared';
import { getStatusColor, getStatusSymbol } from '@shared/utils';
import dayjs from 'dayjs';
import { DATE_FORMATS } from '@config';
import { CopyIcon } from '@assets/icons/Copy.icon';
import { GraphIcon } from '@assets/icons/Graph.icon';
import { DateIcon } from '@assets/icons/Date.icon';

interface OverviewTabProps {
  record: IHistoryRecord;
}

export function OverviewTab({ record }: OverviewTabProps) {
  return (
    <Stack spacing="xl">
      {/* Status Card */}
      <Card withBorder radius="md" p="lg">
        <Group position="apart" mb="md">
          <Text size="sm">Status Overview</Text>
          <Badge variant="filled" color={getStatusColor(record.status)} size="lg">
            {record.status}
          </Badge>
        </Group>

        <Grid>
          <Grid.Col span={6}>
            <Group spacing="xs" mb="xs">
              <ThemeIcon variant="light" size="sm" color="blue">
                <Text size="sm">#</Text>
              </ThemeIcon>
              <Text size="sm">Import ID</Text>
            </Group>
            <Group spacing="xs">
              <Code>{record._id}</Code>
              <CopyButton value={record._id}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied' : 'Copy Upload Id'}>
                    <ActionIcon variant="subtle" size="sm" onClick={copy}>
                      <Text size="xs">{copied ? '✓' : <CopyIcon />}</Text>
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
          </Grid.Col>

          <Grid.Col span={6}>
            <Group spacing="xs" mb="xs">
              <GraphIcon />
              <Text size="sm">Total Records</Text>
            </Group>
            <Text size="lg" fw={700} c="blue">
              {record.totalRecords || 0}
            </Text>
          </Grid.Col>
        </Grid>
      </Card>

      {/* Timeline Card */}
      <Card withBorder radius="md" p="lg">
        <Text size="sm" mb="md">
          Timeline
        </Text>
        <Timeline active={1} bulletSize={24} lineWidth={2}>
          <Timeline.Item
            bullet={
              <Text size="sm">
                <DateIcon size="md" color="white" />
              </Text>
            }
            title="Upload Date"
          >
            <Text c="dimmed" size="sm">
              {dayjs(record.uploadedDate).format(DATE_FORMATS.LONG)}
            </Text>
          </Timeline.Item>
          <Timeline.Item
            bullet={<Text size="sm">{getStatusSymbol(record.status)}</Text>}
            title="Current Status"
            color={getStatusColor(record.status)}
          >
            <Badge variant="light" color={getStatusColor(record.status)} size="sm">
              {record.status}
            </Badge>
          </Timeline.Item>
        </Timeline>
      </Card>
    </Stack>
  );
}
