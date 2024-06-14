import React from 'react';
import { Stack, Button, useMantineTheme } from '@mantine/core';
import { useAddCard } from '@hooks/useAddCard';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { notify } from '@libs/notify';
import { NOTIFICATION_KEYS } from '@config';

interface AddCardModalProps {
  close: () => void;
  refetchPaymentMethods: () => void;
}

export const AddCardModal = ({ close, refetchPaymentMethods }: AddCardModalProps) => {
  const theme = useMantineTheme();
  const cardStyle = {
    style: {
      base: {
        color: theme.colorScheme === 'dark' ? '#fff' : '#000',
        '::placeholder': {
          color: theme.colorScheme === 'dark' ? '#aaa' : '#555',
        },
      },
      invalid: {
        color: theme.colors.red[7],
      },
    },
  };
  const stripe = useStripe();
  const elements = useElements();
  const { addPaymentMethod, isAddPaymentMethodLoading } = useAddCard({ close, refetchPaymentMethods });

  const handleAddCard = async () => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) return;

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (paymentMethod) {
      return addPaymentMethod(paymentMethod.id);
    }

    if (error) {
      notify(NOTIFICATION_KEYS.ERROR_ADDING_PAYMENT_METHOD, {
        title: 'Error adding card!',
        message:
          error.message || 'Something went wrong while adding card. Please try with different card or try again later.',
        color: 'red',
      });
    }
  };

  return (
    <Stack spacing="md">
      <CardElement options={cardStyle} />
      <Button loading={isAddPaymentMethodLoading} fullWidth onClick={handleAddCard}>
        Add Card
      </Button>
    </Stack>
  );
};
