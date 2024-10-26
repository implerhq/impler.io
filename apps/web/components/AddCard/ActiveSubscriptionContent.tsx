import React from 'react';
import Link from 'next/link';
import { colors } from '@config';
import { LeftArrowIcon } from '@assets/icons/LeftArrow.icon';
import { Card, Stack, Title, Text, Skeleton, Box, Group, Divider, Flex } from '@mantine/core';
import { modals } from '@mantine/modals';
import { getPlanType } from '@shared/utils';
import { ISubscriptionData } from '@impler/shared';

interface ActiveSubscriptionContentProps {
  email: string;
  activePlanDetails?: ISubscriptionData;
  isActivePlanDetailsLoading?: boolean;
}

export function ActiveSubscriptionContent({
  activePlanDetails,
  isActivePlanDetailsLoading,
}: ActiveSubscriptionContentProps) {
  const planAmount = Number(activePlanDetails?.amount) || 0;
  const outstandingCharges = Number(activePlanDetails?.plan?.charge) || 0;
  const tax = Number(activePlanDetails?.tax) || 0;

  const totalAmount = planAmount + outstandingCharges + tax;

  return (
    <Card bg={colors.black} shadow="sm" w="50%" radius={0}>
      <Stack spacing="lg">
        <Link onClick={() => modals.closeAll()} href="#">
          <Flex align="center" gap={5}>
            <LeftArrowIcon size="lg" color="currentColor" />
            <Text size="xl">Back</Text>
          </Flex>
        </Link>

        {isActivePlanDetailsLoading ? (
          <Box p="xs">
            <Stack spacing="xs">
              <Skeleton height={20} radius={0} />
              <Skeleton height={20} radius={0} />
              <Skeleton height={20} radius={0} />
              <Skeleton height={20} radius={0} />
              <Skeleton height={20} radius={0} />
              <Skeleton height={20} radius={0} />
            </Stack>
          </Box>
        ) : activePlanDetails ? (
          <>
            <Title order={1} fw="bold" color={colors.white}>
              ${planAmount}
              <Text color={colors.grey} component="span" size="sm">
                {' / '} {getPlanType(activePlanDetails.plan?.interval)}
              </Text>
            </Title>

            <Stack spacing="lg">
              <Group position="apart">
                <Text>Plan Name</Text>
                <Text>{activePlanDetails?.plan.name}</Text>
              </Group>
              <Divider />
              <Group position="apart">
                <Text>Plan Amount</Text>
                <Text>{`${planAmount} (${activePlanDetails.customer?.paymentMethodCurrency?.toUpperCase()})`}</Text>
              </Group>
              {outstandingCharges > 0 && (
                <Group position="apart">
                  <Text>Outstanding Charges</Text>
                  <Text>
                    {outstandingCharges}
                    <Text component="span" color={colors.grey}>
                      {` (${activePlanDetails.customer?.paymentMethodCurrency?.toUpperCase()})`}
                    </Text>
                  </Text>
                </Group>
              )}

              {tax > 0 && (
                <Group position="apart">
                  <Text>Tax</Text>
                  <Text>{`${tax} (${activePlanDetails.customer?.paymentMethodCurrency?.toUpperCase()})`}</Text>
                </Group>
              )}

              <Group position="apart">
                <Text>Total Amount</Text>
                <Text>
                  {`${totalAmount.toFixed(2)} (${activePlanDetails.customer?.paymentMethodCurrency?.toUpperCase()})`}
                </Text>
              </Group>
            </Stack>
          </>
        ) : null}
      </Stack>
    </Card>
  );
}
