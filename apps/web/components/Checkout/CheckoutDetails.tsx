import { Group, Text, Divider, Skeleton, Stack, Box, useMantineTheme } from '@mantine/core';

interface CheckoutDetailsProps {
  checkoutData?: ICheckoutData;
  isCheckoutDataLoading: boolean;
}

export function CheckoutDetails({ checkoutData, isCheckoutDataLoading }: CheckoutDetailsProps) {
  const theme = useMantineTheme();

  if (isCheckoutDataLoading)
    return (
      <Box
        p="xs"
        style={{ border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4]}` }}
      >
        <Stack spacing="xs">
          <Skeleton height={20} radius={0} />
          <Skeleton height={20} radius={0} />
          <Skeleton height={20} radius={0} />
          <Skeleton height={20} radius={0} />
          <Skeleton height={20} radius={0} />
          <Skeleton height={20} radius={0} />
        </Stack>
      </Box>
    );

  if (checkoutData)
    return (
      <Stack spacing="sm">
        <Group position="apart">
          <Text>Plan Name</Text>
          <Text>{checkoutData.planName}</Text>
        </Group>
        <Divider />
        <Group position="apart">
          <Text>Plan Amount</Text>
          <Text>{`${checkoutData.planAmount} (${checkoutData.currency.toUpperCase()})`}</Text>
        </Group>

        {checkoutData.proratedRefund ? (
          <Group position="apart">
            <Text>Prorated Refund</Text>
            <Text>-{`${checkoutData.proratedRefund} (${checkoutData.currency.toUpperCase()})`}</Text>
          </Group>
        ) : null}

        <Group position="apart">
          <Text>Outstanding Charges</Text>
          <Text>{`${checkoutData.outstandingAmount} (${checkoutData.currency.toUpperCase()})`}</Text>
        </Group>

        {checkoutData.taxAmount ? (
          <Group position="apart">
            <Text>Tax {`(${checkoutData.taxLabel} ${checkoutData.taxPercentage}%)`}</Text>
            <Text>{`${checkoutData.taxAmount} (${checkoutData.currency.toUpperCase()})`}</Text>
          </Group>
        ) : null}
        {checkoutData.discount ? (
          <Group position="apart">
            <Text>Coupon Discount</Text>
            <Text>-{`${checkoutData.discount} (${checkoutData.currency.toUpperCase()})`}</Text>
          </Group>
        ) : null}

        {typeof checkoutData.totalPrice !== 'undefined' ? (
          <>
            <Divider />
            <Group position="apart">
              <Text>Total Amount</Text>
              <Text>{`${checkoutData.totalPrice} (${checkoutData.currency.toUpperCase()})`}</Text>
            </Group>
          </>
        ) : null}
      </Stack>
    );

  return null;
}
