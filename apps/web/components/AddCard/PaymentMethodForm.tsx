import { colors } from '@config';
import { Box, Card, Group, Stack, Title, Text } from '@mantine/core';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import { Button } from '@ui/button';
import { notify } from '@libs/notify';
import { NOTIFICATION_KEYS } from '@config';
import { PaymentMethods } from './PaymentMethods';
import { Coupon } from './Coupon';
import { StripeCardExpiryElementOptions } from '@stripe/stripe-js';

interface PaymentMethodFormProps {
  paymentMethods: any;
  handleAddCard: () => void;
  email: string;
  planCode: string;
  isPaymentMethodLoading: boolean;
  selectedPaymentMethod?: string;
  handlePaymentMethodChange: (paymentMethodId: string) => void;
  isCouponFeatureEnabled: string;
  appliedCouponCode?: string;
  setAppliedCouponCode: (code?: string) => void;
  isPurchaseLoading: boolean;
  handleProceed: () => void;
}

export function PaymentMethodForm({
  handleAddCard,
  planCode,
  isPaymentMethodLoading,
  paymentMethods,
  selectedPaymentMethod,
  handlePaymentMethodChange,
  handleProceed,
  isCouponFeatureEnabled,
  isPurchaseLoading,
  setAppliedCouponCode,
  appliedCouponCode,
}: PaymentMethodFormProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };

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

  const handleAddCardAndSubscribe = async () => {
    setIsProcessing(true);

    try {
      await handleAddCard();

      if (!isPaymentMethodLoading) {
        await handleProceed();
      }
    } catch (error) {
      notify(NOTIFICATION_KEYS.ERROR_ADDING_PAYMENT_METHOD, {
        title: 'Error during subscription!',
        message: 'Something went wrong while processing your subscription. Please try again later.',
        color: 'red',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!paymentMethods.length) {
      setIsFormVisible(true);
    }
  }, [paymentMethods]);

  return (
    <Card bg={colors.white} withBorder shadow="sm" w="50%" radius={0}>
      <Stack spacing="md" style={{ height: '100%' }}>
        <Group position="apart" mb="md">
          <Title fw="bold" order={3}>
            Payment Method
          </Title>
          <Button onClick={toggleFormVisibility}>+ Add New Card</Button>
        </Group>

        <PaymentMethods
          paymentMethods={paymentMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          handlePaymentMethodChange={handlePaymentMethodChange}
        />

        {isCouponFeatureEnabled === 'true' && (
          <Coupon planCode={planCode} couponCode={appliedCouponCode} setAppliedCouponCode={setAppliedCouponCode} />
        )}

        {isFormVisible && (
          <Stack spacing="md" my="md">
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
        )}

        <Box mt="auto">
          <Button
            loading={isProcessing || isPaymentMethodLoading || isPurchaseLoading}
            onClick={handleAddCardAndSubscribe}
            fullWidth
            color="blue"
            size="md"
          >
            Subscribe
          </Button>
        </Box>
      </Stack>
    </Card>
  );
}
