import React from 'react';
import { BackArrowIcon } from '@assets/icons/BackArrow.icon';
import { CheckoutDetails } from '@components/Checkout';
import { colors, MODAL_KEYS } from '@config';
import { Card, Stack, Title, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { getPlanType } from '@shared/utils';
import { Button } from '@ui/button';

interface CheckoutContentProps {
  checkoutData?: ICheckoutData;
  isCheckoutDataLoading: boolean;
}

export function CheckoutContent({ checkoutData, isCheckoutDataLoading }: CheckoutContentProps) {
  return (
    <Card bg={colors.black} shadow="sm" padding="lg" w="50%" radius={0}>
      <Stack spacing="sm">
        <Button
          leftIcon={<BackArrowIcon />}
          variant="outline"
          size="md"
          onClick={() => modals.close(MODAL_KEYS.SELECT_CARD)}
        >
          Back
        </Button>
        <Text size="md">Subscribe to Transaction {checkoutData?.planName}</Text>
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
