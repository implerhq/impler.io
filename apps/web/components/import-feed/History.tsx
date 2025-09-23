import { Stack, Group, Button, Badge } from '@mantine/core';
import React, { ChangeEvent } from 'react';
import { LoadingOverlay, TextInput as Input, Title } from '@mantine/core';

import { Table } from '@ui/table';
import { VARIABLES } from '@config';
import { Pagination } from '@ui/pagination';
import { DateInput } from '@ui/date-input';
import { useHistory } from '@hooks/useHistory';
import { IHistoryRecord } from '@impler/shared';
import { SearchIcon } from '@assets/icons/Search.icon';

export function History() {
  const {
    historyData,
    isHistoryDataLoading,
    onLimitChange,
    onPageChange,
    onNameChange,
    onDateChange,
    openViewImportHistoryModal,
    name,
    date,
  } = useHistory();

  return (
    <Stack spacing="xs">
      <Title order={3}>History</Title>
      <Group spacing="xs" style={{ position: 'relative' }}>
        <Input
          type="search"
          defaultValue={name}
          icon={<SearchIcon />}
          placeholder="Search imports by name..."
          onChange={(e: ChangeEvent<HTMLInputElement>) => onNameChange(e.currentTarget.value)}
        />
        <DateInput
          allowDeselect
          placeholder="DD/MM/YYYY"
          valueFormat="DD/MM/YYYY"
          value={date}
          onChange={onDateChange}
          maw={200}
        />
      </Group>
      <Stack spacing="sm" style={{ position: 'relative' }}>
        <LoadingOverlay visible={isHistoryDataLoading} />
        <Table<IHistoryRecord>
          headings={[
            {
              title: 'Name',
              key: 'name',
            },
            {
              title: 'Date',
              key: 'uploadedDate',
              Cell(item) {
                return new Date(item.uploadedDate).toLocaleDateString();
              },
            },
            {
              title: 'Time',
              key: 'uploadedDate',
              Cell(item) {
                return new Date(item.uploadedDate).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                });
              },
            },
            {
              title: 'Status',
              key: 'status',
              Cell(item) {
                return (
                  <Badge size="sm" color={item.status === 'Completed' ? 'green' : undefined}>
                    {item.status}
                  </Badge>
                );
              },
            },
            {
              title: 'Records',
              key: 'totalRecords',
            },
            {
              title: 'History',
              key: 'details',
              width: 100,
              Cell(item: IHistoryRecord) {
                return (
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => {
                      openViewImportHistoryModal(item);
                    }}
                  >
                    View
                  </Button>
                );
              },
            },
          ]}
          data={historyData?.data || []}
        />
        <Pagination
          dataLength={historyData?.data.length || VARIABLES.ZERO}
          limit={historyData?.limit || VARIABLES.ZERO}
          onLimitChange={onLimitChange}
          page={historyData?.page || VARIABLES.ZERO}
          setPage={onPageChange}
          totalPages={historyData?.totalPages || VARIABLES.ZERO}
          totalRecords={historyData?.totalRecords || VARIABLES.ZERO}
        />
      </Stack>
    </Stack>
  );
}
