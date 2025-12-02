import { GridIcon, Warning, LockIcon } from '@icons';
import { Box, Group, Skeleton, Stack, Table, Text, Tooltip } from '@mantine/core';
import { Button } from '@ui/Button';
import { WIDGET_TEXTS } from '@impler/client';
import { IColumn, numberFormatter, replaceVariablesInString } from '@impler/shared';

interface DirectEntryViewProps {
  limit?: number;
  className?: string;
  columns?: IColumn[];
  isLoading?: boolean;
  texts: typeof WIDGET_TEXTS;
  isManualDataEntryAvailable?: boolean;
  onManuallyEnterData?: () => void;
}

export function DirectEntryView({
  limit,
  texts,
  columns,
  isLoading,
  className,
  onManuallyEnterData,
  isManualDataEntryAvailable,
}: DirectEntryViewProps) {
  return (
    <Box bg="var(--primary-background)" pt="sm" pl="sm" className={className}>
      <Stack spacing="xs">
        <Group>
          <Tooltip
            label="This feature is not in your current plan"
            disabled={isManualDataEntryAvailable !== false}
            position="top"
          >
            <Button
              loading={isLoading}
              onClick={onManuallyEnterData}
              leftIcon={isManualDataEntryAvailable === false ? <LockIcon /> : <GridIcon />}
              disabled={isManualDataEntryAvailable === false}
            >
              {texts['PHASE1-2'].ENTER_DATA}
            </Button>
          </Tooltip>
        </Group>
        {limit ? (
          <Group>
            <Warning fill="var(--error-color)" />{' '}
            <Text>
              {replaceVariablesInString(texts['PHASE1-2'].RECOMMENDED_LIMIT, {
                records: numberFormatter(limit),
              })}
            </Text>
          </Group>
        ) : null}

        <Box
          pl="xs"
          pt="xs"
          bg="var(--primary-background)"
          style={{
            overflow: 'hidden',
            boxShadow: '-1px 3px 11px 0px #00000014',
            borderTopLeftRadius: 'var(--border-radius)',
          }}
        >
          <Table>
            <thead style={{ backgroundColor: 'var(--secondary-background-hover)' }}>
              <tr>
                {columns?.map((column) => (
                  <th style={{ textWrap: 'nowrap', color: 'var(--secondary-background)' }} key={column.name}>
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 3 }).map((_, index) => (
                <tr key={index}>
                  {columns?.map((column) => (
                    <td key={column.name}>
                      <Skeleton animate={false} height={15} radius="md" width="75%" bg="var(--secondary-background)" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
      </Stack>
    </Box>
  );
}
