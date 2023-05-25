import { useState } from 'react';
import { Group, Stack, Title } from '@mantine/core';

import { Input } from '@ui/input';
import { Table } from '@ui/table';
import { Pagination } from '@ui/pagination';
import { DateInput } from '@ui/date-input';

export function History() {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <Stack spacing="md">
      <Title order={2}>Import History</Title>
      <Group spacing="xs" style={{ position: 'relative' }}>
        <Input placeholder="Search imports by name..." />
        <DateInput placeholder="DD/MM/YYYY" value={selectedDate} onChange={setSelectedDate} maw={200} />
      </Group>
      <Stack spacing="sm">
        <Table
          headings={[
            {
              title: 'Import Id',
              key: '_id',
            },
            {
              title: 'Name',
              key: 'name',
            },
            {
              title: 'Date',
              key: 'date',
            },
            {
              title: 'Time',
              key: 'time',
            },
            {
              title: 'Status',
              key: 'status',
            },
            {
              title: 'Records',
              key: 'totalRecords',
            },
          ]}
          data={[
            {
              _id: '1',
              name: 'Import 1',
              date: '2021-09-01',
              time: '12:00 AM',
              status: 'Success',
              totalRecords: 100,
            },
            {
              _id: '2',
              name: 'Import 2',
              date: '2021-08-01',
              time: '01:00 PM',
              status: 'Processing',
              totalRecords: 50,
            },
          ]}
        />
        <Pagination
          dataLength={100}
          limit={10}
          onLimitChange={() => {}}
          page={9}
          setPage={() => {}}
          totalPages={10}
          totalRecords={100}
        />
      </Stack>
    </Stack>
  );
}
