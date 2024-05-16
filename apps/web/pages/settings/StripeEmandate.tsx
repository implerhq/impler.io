import React from 'react';
import { Flex, Title, Text } from '@mantine/core';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button } from '@ui/button';
import { useUpdateUser } from '@hooks/useUpdateUser';

const StripeEmandate = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { addPaymentMethod } = useUpdateUser();

  const handleCard = async () => {
    const { paymentMethod } = await stripe?.createPaymentMethod({
      type: 'card',
      card: elements?.getElement(CardElement),
    });
    if (paymentMethod) {
      addPaymentMethod(paymentMethod.id);
    }
  };

  return (
    <Flex direction="column" gap="xs" my="sm">
      <Title order={3}>Save Card</Title>
      <Text>Enter your card details</Text>

      <div style={{ width: '300px', background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
        <CardElement />
      </div>
      <Button onClick={handleCard}>Add</Button>
    </Flex>
  );
};

export default StripeEmandate;
