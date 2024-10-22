import React from 'react';
import { Group, Stack } from '@mantine/core';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { StripeInput } from './StripeInput';

export function AddNewPaymentMethodForm() {
  return (
    <Stack spacing="md">
      <StripeInput label="Card Number" StripeElement={CardNumberElement} isFullWidth />

      <Group grow>
        <StripeInput label="Expiry Date" StripeElement={CardExpiryElement} />
        <StripeInput label="CVV" StripeElement={CardCvcElement} />
      </Group>
    </Stack>
  );
}
