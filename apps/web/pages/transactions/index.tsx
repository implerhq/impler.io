import Link from 'next/link';
import { Group, LoadingOverlay, Stack, Title } from '@mantine/core';

import { ROUTES } from '@config';
import { Table } from '@ui/table';
import { Button } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { AppLayout } from '@layouts/AppLayout';
import { capitalizeFirstLetter } from '@shared/utils';
import { LeftArrowIcon } from '@assets/icons/LeftArrow.icon';
import { useTransactionHistory } from '@hooks/useTransactionHistory';

export default function Transactions() {
  const { transactions, isTransactionsLoading } = useTransactionHistory();

  return (
    <Stack spacing="xs">
      <Group spacing="xs">
        <Button variant="outline" component={Link} href={ROUTES.HOME} color="invariant">
          <LeftArrowIcon />
        </Button>
        <Group spacing={0}>
          <Title order={3}>Transaction History</Title>
        </Group>
      </Group>
      <Stack spacing="sm" style={{ position: 'relative' }}>
        <LoadingOverlay visible={isTransactionsLoading} />
        <Table<ITransactionHistory>
          headings={[
            {
              title: 'Transaction Date',
              key: 'transactionDate',
            },
            {
              title: 'Plan Name',
              key: 'planName',
            },
            {
              title: 'Transaction Status',
              key: 'transactionStatus',
              Cell(item) {
                return capitalizeFirstLetter(item.transactionStatus);
              },
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
              title: 'Is Active',
              key: 'isPlanActive',
              Cell(item) {
                return <Checkbox checked={item.isPlanActive} />;
              },
            },
            {
              title: 'Extra Usage Charge',
              key: 'charge',
            },
            {
              title: 'Plan Amount',
              key: 'amount',
            },
            {
              title: 'Currency',
              key: 'currency',
              Cell(item) {
                return item.currency?.toUpperCase();
              },
            },
          ]}
          data={transactions || []}
        />
      </Stack>
    </Stack>
  );
}

Transactions.Layout = AppLayout;

export async function getServerSideProps() {
  return {
    props: {
      title: 'Transactions',
    },
  };
}
