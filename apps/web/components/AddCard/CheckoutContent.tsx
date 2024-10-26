import React from 'react';
import Link from 'next/link';
import { Card, Stack, Title, Text, Flex } from '@mantine/core';

import { colors, MODAL_KEYS } from '@config';
import { getPlanType } from '@shared/utils';
import { CheckoutDetails } from '@components/Checkout';
import { LeftArrowIcon } from '@assets/icons/LeftArrow.icon';
import { modals } from '@mantine/modals';

interface CheckoutContentProps {
  checkoutData?: ICheckoutData;
  isCheckoutDataLoading: boolean;
}

export function CheckoutContent({ checkoutData, isCheckoutDataLoading }: CheckoutContentProps) {
  return (
    <Card bg={colors.black} shadow="sm" padding="lg" w="50%" radius={0}>
      <Stack spacing="sm">
        <Link onClick={() => modals.close(MODAL_KEYS.SELECT_CARD)} href="#">
          <Flex align="center" gap={5}>
            <LeftArrowIcon size="lg" color="currentColor" />
            <Text size="xl">Back</Text>
          </Flex>
        </Link>

        <Text size="md">
          Get{' '}
          <Text component="span" color={colors.yellow}>
            {checkoutData?.planName}
          </Text>{' '}
          Benefits
        </Text>
        <Title order={1} fw="bold" color={colors.white}>
          ${checkoutData?.planAmount}
          <Text color={colors.grey} component="span" size="sm">
            {' / '} {getPlanType(checkoutData?.interval)}
          </Text>
        </Title>
        <CheckoutDetails checkoutData={checkoutData} isCheckoutDataLoading={isCheckoutDataLoading} />
      </Stack>
    </Card>
  );
}
