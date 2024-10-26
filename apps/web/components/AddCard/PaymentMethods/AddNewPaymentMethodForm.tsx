import React, { useEffect, useState } from 'react';
import { Group, Stack } from '@mantine/core';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements } from '@stripe/react-stripe-js';
import { StripeInput } from './StripeInput';
interface AddNewPaymentMethodFormProps {
  setIsValid: (isValid: boolean) => void;
}

export function AddNewPaymentMethodForm({ setIsValid }: AddNewPaymentMethodFormProps) {
  const elements = useElements();
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const handleChange = (event: any, field: keyof typeof errors) => {
    if (event.error) {
      setErrors((prev) => ({
        ...prev,
        [field]: event.error.message,
      }));
      setIsValid(false);
    } else {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
      const allFieldsValid = Object.values(errors).every((error) => !error);
      setIsValid(allFieldsValid);
    }
  };

  const validateForm = () => {
    const cardNumber = elements?.getElement('cardNumber');
    const cardExpiry = elements?.getElement('cardExpiry');
    const cardCvc = elements?.getElement('cardCvc');

    let isValid = true;
    const newErrors = { ...errors };

    if (!cardNumber) {
      newErrors.cardNumber = 'Card number is required';
      isValid = false;
    }
    if (!cardExpiry) {
      newErrors.cardExpiry = 'Expiry date is required';
      isValid = false;
    }
    if (!cardCvc) {
      newErrors.cardCvc = 'CVC is required';
      isValid = false;
    }

    setErrors(newErrors);
    setIsValid(isValid);

    return isValid;
  };

  useEffect(() => {
    validateForm();
  }, []);

  return (
    <Stack spacing="md">
      <StripeInput
        label="Card Number"
        StripeElement={CardNumberElement}
        isFullWidth
        required
        error={errors.cardNumber}
        onChange={(event) => handleChange(event, 'cardNumber')}
      />
      <Group grow>
        <StripeInput
          label="Expiry Date"
          StripeElement={CardExpiryElement}
          required
          error={errors.cardExpiry}
          onChange={(event) => handleChange(event, 'cardExpiry')}
        />
        <StripeInput
          label="CVV"
          StripeElement={CardCvcElement}
          required
          error={errors.cardCvc}
          onChange={(event) => handleChange(event, 'cardCvc')}
        />
      </Group>
    </Stack>
  );
}
