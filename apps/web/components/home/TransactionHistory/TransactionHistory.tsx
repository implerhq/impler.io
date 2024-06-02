import { useTransactionHistory } from '@hooks/useTransactionHistory';
import { Group, LoadingOverlay, Stack, Title } from '@mantine/core';

import { Table } from '@ui/table';

export function TransactionHistory() {
  const { transactions, isTransactionsLoading } = useTransactionHistory();

  return (
    <Stack spacing="xs">
      <Title order={3}>Transaction History</Title>
      <Group spacing="xs" style={{ position: 'relative' }}></Group>
      <Stack spacing="sm" style={{ position: 'relative' }}>
        <LoadingOverlay visible={isTransactionsLoading} />
        <Table
          headings={[
            {
              title: 'Date',
              key: 'transactionDate',
            },
            {
              title: 'Plan Name',
              key: 'planName',
            },
            {
              title: 'Transaction Status',
              key: 'transactionStatus',
            },
            {
              title: 'Membership Date',
              key: 'membershipDate',
            },
            {
              title: 'Expiry Date',
              key: 'expiryDate',
            },
            {
              title: 'Plan Status',
              key: 'isPlanActive',
            },
            {
              title: 'Charge',
              key: 'charge',
            },
          ]}
          data={transactions || []}
        />
      </Stack>
    </Stack>
  );
}
