import { colors, ROUTES } from '@config';
import { Divider, Stack, Text, Title, Center, Group } from '@mantine/core';
import { Button } from '@ui/button';
import Link from 'next/link';
import React from 'react';

interface InactiveMembershipProps {
  showPlans: () => void;
}

export function InactiveMembership({ showPlans }: InactiveMembershipProps) {
  return (
    <Stack>
      <Group position="apart" align="center" spacing="sm">
        <Title order={4}>Plan Expiry</Title>
        <Button component={Link} href={ROUTES.TRANSACTIONS} variant="filled" radius="md">
          View all Transactions
        </Button>
      </Group>
      <Divider />

      <Center>
        <Stack w={500} align="center">
          <Text fw="bolder" color={colors.danger} align="center">
            You don&apos;t have any active membership. Consider choosing an appropriate plan. You can see all
            transactions{' '}
            <Text component={Link} href={ROUTES.TRANSACTIONS} color={colors.yellow} td="underline">
              here.
            </Text>
          </Text>
          <Button onClick={showPlans}>Choose Plan</Button>
        </Stack>
      </Center>
    </Stack>
  );
}
