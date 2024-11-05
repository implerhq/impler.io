import React, { useEffect, useState } from 'react';
import { Group, Stack } from '@mantine/core';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { StripeInput } from './StripeInput';
import { colors } from '@config';

interface AddNewPaymentMethodFormProps {
  setIsValid: (isValid: boolean) => void;
}

const stripeElementStyle = {
  style: {
    base: {
      color: colors.black,
      '::placeholder': {
        color: colors.black,
      },
    },
    invalid: {
      color: colors.danger,
    },
  },
};

const stripeElementOptions = {
  cardNumber: {
    ...stripeElementStyle,
    showIcon: true,
  },
  cardExpiry: {
    ...stripeElementStyle,
  },
  cardCvc: {
    ...stripeElementStyle,
  },
};

export function AddNewPaymentMethodForm({ setIsValid }: AddNewPaymentMethodFormProps) {
  const [fields, setFields] = useState({
    cardNumber: {
      complete: false,
      error: '',
      touched: false,
    },
    cardExpiry: {
      complete: false,
      error: '',
      touched: false,
    },
    cardCvc: {
      complete: false,
      error: '',
      touched: false,
    },
  });

  const handleElementChange = (event: any, fieldName: keyof typeof fields) => {
    setFields((prev) => {
      const newFields = {
        ...prev,
        [fieldName]: {
          complete: event.complete,
          error: event.error?.message || '',
          touched: true,
        },
      };

      return newFields;
    });
  };

  useEffect(() => {
    const isFormValid = Object.values(fields).every((field) => {
      const fieldValid = field.complete && !field.error;

      return fieldValid;
    });

    setIsValid(isFormValid);
  }, [fields, setIsValid]);

  const getFieldError = (fieldName: keyof typeof fields) => {
    const field = fields[fieldName];
    if (!field.touched) return '';
    if (field.error) return field.error;
    if (!field.complete) return 'This field is required';

    return '';
  };

  return (
    <Stack spacing="md">
      <StripeInput
        label="Card Number"
        StripeElement={CardNumberElement}
        isFullWidth
        required
        error={getFieldError('cardNumber')}
        onChange={(event) => handleElementChange(event, 'cardNumber')}
        options={stripeElementOptions.cardNumber}
      />
      <Group grow>
        <StripeInput
          label="Expiry Date"
          StripeElement={CardExpiryElement}
          required
          error={getFieldError('cardExpiry')}
          onChange={(event) => handleElementChange(event, 'cardExpiry')}
          options={stripeElementOptions.cardExpiry}
        />
        <StripeInput
          label="CVV"
          StripeElement={CardCvcElement}
          required
          error={getFieldError('cardCvc')}
          onChange={(event) => handleElementChange(event, 'cardCvc')}
          options={stripeElementOptions.cardCvc}
        />
      </Group>
    </Stack>
  );
}
