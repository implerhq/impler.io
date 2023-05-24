import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Group, Stack, Title } from '@mantine/core';

import { Input } from '@ui/input';
import { Table } from '@ui/table';
import { Button } from '@ui/button';
import { Pagination } from '@ui/pagination';
import { CalendarIcon } from '@assets/icons/Calendar.icon';

export function History() {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  return (
    <Stack spacing="md">
      <Title order={2}>Import History</Title>
      <Group>
        <Input />
        <Button variant="outline" color="blue" onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
          <CalendarIcon />
        </Button>
        {isDatePickerOpen && <DatePicker selected={new Date()} onChange={() => {}} />}
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
