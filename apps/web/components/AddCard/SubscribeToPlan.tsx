import React from 'react';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Flex } from '@mantine/core';

import { useCheckout } from '@hooks/useCheckout';
import { useSubscribe } from '@hooks/useSubscribe';

import { useAddCardAndSubscribe } from '@hooks/useAddCardAndSubscribe';
import { CheckoutContent } from './CheckoutContent';
import { PaymentMethodForm } from './PaymentMethodForm';
import { usePaymentMethods } from '@hooks/usePaymentMethods';

export interface SelectCardModalContentProps {
  email: string;
  planCode: string;
  onClose: () => void;
}

export function SubscribeToPlan({ email, planCode }: SelectCardModalContentProps) {
  const { refetchPaymentMethods, paymentMethods, isPaymentMethodsLoading } = usePaymentMethods();

  const {
    handleProceed,
    appliedCouponCode,
    isPurchaseLoading,
    setAppliedCouponCode,
    isCouponFeatureEnabled,
    isPaymentMethodsFetching,
  } = useSubscribe({
    email,
    planCode,
  });

  const { getCheckoutData, checkoutData, isCheckoutDataLoading } = useCheckout({
    couponCode: appliedCouponCode,
    planCode,
    email,
  });

  const stripe = useStripe();
  const elements = useElements();

  const { addPaymentMethod, isAddPaymentMethodLoading, setIsPaymentMethodLoading } = useAddCardAndSubscribe({
    refetchPaymentMethods,
    handleProceed,
  });

  const handleAddCard = async () => {
    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) return;

    setIsPaymentMethodLoading(true);
    const { paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
    });

    if (paymentMethod) {
      addPaymentMethod(paymentMethod.id);
    }
  };

  return (
    <Flex m={-20} gap={0}>
      <CheckoutContent checkoutData={checkoutData} isCheckoutDataLoading={isCheckoutDataLoading} />

      <PaymentMethodForm
        email={email}
        planCode={planCode}
        handleAddCard={handleAddCard}
        handleProceed={handleProceed}
        paymentMethods={paymentMethods}
        getCheckoutData={getCheckoutData}
        appliedCouponCode={appliedCouponCode}
        isPurchaseLoading={isPurchaseLoading}
        setAppliedCouponCode={setAppliedCouponCode}
        isCouponFeatureEnabled={isCouponFeatureEnabled}
        isAddPaymentMethodLoading={isAddPaymentMethodLoading}
        isPaymentMethodsLoading={isPaymentMethodsLoading}
        isPaymentMethodsFetching={isPaymentMethodsFetching}
      />
    </Flex>
  );
}
