import React from 'react';
import { BackArrowIcon } from '@assets/icons/BackArrow.icon';
import { colors } from '@config';
import { Card, Stack, Title, Text, Skeleton, Box, Group, Divider } from '@mantine/core';
import { modals } from '@mantine/modals';
import { getPlanType } from '@shared/utils';
import { Button } from '@ui/button';
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
  console.log(activePlanDetails?.customer?.paymentMethodCurrency);

  return (
    <Card bg={colors.black} shadow="sm" w="50%" radius={0}>
      <Stack spacing="lg">
        <Button leftIcon={<BackArrowIcon />} variant="outline" size="md" onClick={() => modals.closeAll()}>
          Back
        </Button>

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
              ${activePlanDetails?.plan?.fixedCost}
              <Text color={colors.grey} component="span" size="sm">
                {' / '} {getPlanType(activePlanDetails.plan?.interval)}
              </Text>
            </Title>

            <Stack spacing="lg">
              <Group position="apart">
                {/* Added spacing here */}
                <Text>Plan Name</Text>
                <Text>{activePlanDetails?.plan.name}</Text>
              </Group>
              <Divider />
              <Group position="apart">
                <Text>Plan Amount</Text>
                <Text>{`${activePlanDetails?.plan
                  .fixedCost} (${activePlanDetails.customer?.paymentMethodCurrency?.toUpperCase()})`}</Text>
              </Group>
              {activePlanDetails.plan.charges && (
                <Group position="apart">
                  {' '}
                  <Text>Outstanding Charges</Text>
                  <Text>
                    {activePlanDetails?.plan?.charge}
                    <Text component="span" color={colors.grey}>
                      {` (${activePlanDetails.customer?.paymentMethodCurrency?.toUpperCase()})`}
                    </Text>
                  </Text>
                </Group>
              )}
              {activePlanDetails && (
                <Group position="apart">
                  <Text>Renew Amount</Text>
                  <Text>
                    {activePlanDetails
                      ? `${
                          Number(activePlanDetails?.plan.charge) + Number(activePlanDetails.plan?.fixedCost)
                        } (${activePlanDetails.customer?.paymentMethodCurrency?.toUpperCase()})`
                      : null}
                  </Text>
                </Group>
              )}
            </Stack>
          </>
        ) : null}
      </Stack>
    </Card>
  );
}
