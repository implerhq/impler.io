import { colors, ROUTES } from '@config';
import { Divider, Stack, Text, Title, Center, Group } from '@mantine/core';
import { Button } from '@ui/button';
import Link from 'next/link';
import React from 'react';

interface PlanCancelledProps {
  showPlans: () => void;
  expiryDate: string;
  cancellationDate: string;
  planName: string;
}

export function PlanCancelled({ showPlans, cancellationDate, expiryDate, planName }: PlanCancelledProps) {
  return (
    <Stack>
      <Group position="apart" align="center" spacing="sm">
        <Title order={4}>{planName}</Title>
        <Group spacing="sm" position="right">
          <Button component={Link} href="/transactions" variant="filled">
            View all transactions
          </Button>
          <Button variant="filled" color="green">
            Change Card
          </Button>
        </Group>
      </Group>
      <Divider />

      <Center>
        <Stack align="center">
          <Text fw={700} color={colors.grey} align="center" size="lg">
            Your plan was cancelled on {cancellationDate} and expires on {expiryDate}.
          </Text>
          <Text fw={700} color={colors.grey} align="center" size="lg">
            Consider choosing a new plan. Click{' '}
            <Text component={Link} href={ROUTES.TRANSACTIONS} color={colors.yellow} td="underline">
              here
            </Text>
            .
          </Text>
          <Button onClick={showPlans}>Choose Plan</Button>
        </Stack>
      </Center>
    </Stack>
  );
}
