import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { colors } from '@config';
import { Card, Group, Stack, Title, Text } from '@mantine/core';
import { ICardData } from '@impler/shared';

import { Coupon } from './Coupon';
import { Button } from '@ui/button';
import { PaymentMethods } from './PaymentMethods';
import { AddNewPaymentMethodForm } from './PaymentMethods/AddNewPaymentMethodForm';

interface PaymentMethodFormProps {
  email: string;
  planCode: string;
  handleAddCard: () => void;
  isPurchaseLoading: boolean;
  isPaymentMethodsLoading: boolean;
  isPaymentMethodsFetching: boolean;
  appliedCouponCode?: string;
  paymentMethods?: ICardData[];
  isCouponFeatureEnabled: string;
  isAddPaymentMethodLoading: boolean;
  setAppliedCouponCode: (code?: string) => void;
  handleProceed: (paymentMethodId: string) => void;
  getCheckoutData: (paymentMethodId?: string) => void;
}

export function PaymentMethodForm({
  planCode,
  handleAddCard,
  handleProceed,
  paymentMethods,
  getCheckoutData,
  isPaymentMethodsFetching,
  isPaymentMethodsLoading,
  isPurchaseLoading,
  appliedCouponCode,
  setAppliedCouponCode,
  isCouponFeatureEnabled,
  isAddPaymentMethodLoading,
}: PaymentMethodFormProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>();
  const [showAddNewCardForm, setShowAddNewCardForm] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const toggleFormVisibility = () => {
    setShowAddNewCardForm(!showAddNewCardForm);
    if (!showAddNewCardForm) {
      setSelectedPaymentMethod(undefined);
    }
  };

  const handleSubmit = async () => {
    if (showAddNewCardForm) {
      if (isFormValid) {
        handleAddCard();
      }
    } else if (selectedPaymentMethod) {
      handleProceed(selectedPaymentMethod);
    }
  };
  useEffect(() => {
    if (paymentMethods?.length === 0) {
      setShowAddNewCardForm(true);
      getCheckoutData();
    }
    if (selectedPaymentMethod) {
      getCheckoutData(selectedPaymentMethod);
    } else if (paymentMethods?.length) {
      setSelectedPaymentMethod(paymentMethods[0].paymentMethodId);
      getCheckoutData(paymentMethods[0].paymentMethodId);
    }
  }, [selectedPaymentMethod, paymentMethods, getCheckoutData]);

  return (
    <Card bg={colors.white} withBorder shadow="sm" w="50%" radius={0}>
      <Stack spacing="md" h="100%">
        <Group position="apart">
          <Title color={colors.black} fw="bold" order={3}>
            Payment Method
          </Title>
          {paymentMethods && paymentMethods.length > 0 ? (
            <Link href="#" onClick={toggleFormVisibility}>
              <Text color={colors.blue} weight={500}>
                {showAddNewCardForm ? 'Show Added Cards' : '+ Add New Card'}
              </Text>
            </Link>
          ) : null}
        </Group>

        <Stack spacing="md" style={{ flexGrow: 1 }}>
          {showAddNewCardForm ? (
            <AddNewPaymentMethodForm setIsValid={setIsFormValid} />
          ) : (
            <PaymentMethods
              paymentMethods={paymentMethods}
              selectedPaymentMethod={selectedPaymentMethod}
              handlePaymentMethodChange={setSelectedPaymentMethod}
            />
          )}

          {isCouponFeatureEnabled === 'false' && (
            <Coupon planCode={planCode} couponCode={appliedCouponCode} setAppliedCouponCode={setAppliedCouponCode} />
          )}
        </Stack>

        <Button
          fullWidth
          size="md"
          color="blue"
          loading={
            isAddPaymentMethodLoading || isPurchaseLoading || isPaymentMethodsLoading || isPaymentMethodsFetching
          }
          onClick={handleSubmit}
        >
          {showAddNewCardForm ? 'Add Card and Subscribe' : 'Subscribe'}
        </Button>
      </Stack>
    </Card>
  );
}
