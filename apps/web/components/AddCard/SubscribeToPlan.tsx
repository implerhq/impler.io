import React from 'react';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Flex } from '@mantine/core';

import { useCheckout } from '@hooks/useCheckout';
import { useSubscribe } from '@hooks/useSubscribe';

import { useAddCardAndSubscribe } from '@hooks/useAddCardAndSubscribe';
import { CheckoutContent } from './CheckoutContent';
import { PaymentMethodForm } from './PaymentMethodForm';
import { usePaymentMethods } from '@hooks/usePaymentMethods';
import { notify } from '@libs/notify';
import { NOTIFICATION_KEYS } from '@config';

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

  const { isAddPaymentMethodLoading, setIsPaymentMethodLoading, addPaymentMethod, isCreateSubscriptionLoaiding } =
    useAddCardAndSubscribe({
      refetchPaymentMethods,
      handleProceed,
    });

  const handleAddCard = async () => {
    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) return;

    setIsPaymentMethodLoading(true);
    const response = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
    });

    if (response.error) {
      notify(NOTIFICATION_KEYS.ERROR_ADDING_PAYMENT_METHOD, {
        title: 'Failed to Add Card',
        message: response.error.message || 'An unknown error occurred while adding your card.',
        color: 'red',
      });
      setIsPaymentMethodLoading(false);

      return;
    }

    if (response && response.paymentMethod?.id) {
      addPaymentMethod({
        planCode,
        paymentMethodId: response?.paymentMethod?.id,
      });
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
        isCreateSubscriptionLoading={isCreateSubscriptionLoaiding}
      />
    </Flex>
  );
}
