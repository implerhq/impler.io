import React from 'react';
import { Stack, Button } from '@mantine/core';
import { useAddCard } from '@hooks/useAddCard';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

export function AddCardModal() {
  const stripe = useStripe();
  const elements = useElements();
  const { addPaymentMethod } = useAddCard();

  const handleAddCard = async () => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) return;

    const { paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (paymentMethod) {
      addPaymentMethod(paymentMethod.id);
    }
  };

  return (
    <Stack spacing="md">
      <CardElement />
      <Button fullWidth onClick={handleAddCard}>
        Add Card
      </Button>
    </Stack>
  );
}

export default AddCardModal;
