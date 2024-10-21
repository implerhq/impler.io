import Link from 'next/link';
import { colors } from '@config';
import React, { useEffect, useState } from 'react';
import { StripeCardExpiryElementOptions } from '@stripe/stripe-js';
import { Box, Card, Group, Stack, Title, Text } from '@mantine/core';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';

import { Coupon } from './Coupon';
import { Button } from '@ui/button';
import { PaymentMethods } from './PaymentMethods';

interface PaymentMethodFormProps {
  email: string;
  planCode: string;
  paymentMethods: any;
  handleAddCard: () => void;
  handleProceed: () => void;
  isPurchaseLoading: boolean;
  appliedCouponCode?: string;
  isCouponFeatureEnabled: string;
  selectedPaymentMethod?: string;
  isAddPaymentMethodLoading: boolean;
  setAppliedCouponCode: (code?: string) => void;
  handlePaymentMethodChange: (paymentMethodId: string) => void;
}

const elementOptions: StripeCardExpiryElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#495057',
      '::placeholder': {
        color: '#6c757d',
      },
      backgroundColor: '#fff',
      padding: '10px',
    },
    invalid: {
      color: 'red',
    },
  },
};

export function PaymentMethodForm({
  planCode,
  handleAddCard,
  handleProceed,
  paymentMethods,
  isPurchaseLoading,
  appliedCouponCode,
  setAppliedCouponCode,
  isCouponFeatureEnabled,
  isAddPaymentMethodLoading,
  selectedPaymentMethod,
  handlePaymentMethodChange,
}: PaymentMethodFormProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };

  useEffect(() => {
    if (!paymentMethods.length) {
      setIsFormVisible(true);
    }
  }, [paymentMethods]);

  return (
    <Card bg={colors.white} withBorder shadow="sm" w="50%" radius={0}>
      <Stack spacing="md" h="100%">
        <Group position="apart">
          <Title color={colors.black} fw="bold" order={3}>
            Payment Method
          </Title>
          <Link href="#" onClick={toggleFormVisibility}>
            {isFormVisible ? 'Show Added Cards' : '+ Add New Card'}
          </Link>
        </Group>

        <Stack spacing="md" style={{ flexGrow: 1 }}>
          {isFormVisible ? (
            <Stack spacing="md">
              <Box>
                <Text size="sm" weight={500} color="#333">
                  Card Number
                </Text>
                <Box
                  sx={{
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    padding: '8px',
                    backgroundColor: '#fff',
                  }}
                >
                  <CardNumberElement options={elementOptions} />
                </Box>
              </Box>

              <Group grow>
                <Box>
                  <Text size="sm" weight={500} color="#333">
                    Expiry Date
                  </Text>
                  <Box
                    sx={{
                      border: '1px solid #ced4da',
                      padding: '8px',
                      backgroundColor: '#fff',
                    }}
                  >
                    <CardExpiryElement options={elementOptions} />
                  </Box>
                </Box>

                <Box>
                  <Text size="sm" weight={500} color="#333">
                    CVV
                  </Text>
                  <Box
                    sx={{
                      border: '1px solid #ced4da',
                      padding: '8px',
                      backgroundColor: '#fff',
                    }}
                  >
                    <CardCvcElement options={elementOptions} />
                  </Box>
                </Box>
              </Group>
            </Stack>
          ) : (
            <PaymentMethods
              paymentMethods={paymentMethods}
              selectedPaymentMethod={selectedPaymentMethod}
              handlePaymentMethodChange={handlePaymentMethodChange}
            />
          )}

          {isCouponFeatureEnabled === 'true' && (
            <Coupon planCode={planCode} couponCode={appliedCouponCode} setAppliedCouponCode={setAppliedCouponCode} />
          )}
        </Stack>

        <Button
          loading={isAddPaymentMethodLoading || isPurchaseLoading}
          onClick={isFormVisible ? handleAddCard : handleProceed}
          fullWidth
          color="blue"
          size="md"
        >
          Subscribe
        </Button>
      </Stack>
    </Card>
  );
}
