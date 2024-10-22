import React from 'react';
import { Elements, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import getConfig from 'next/config';
import { loadStripe } from '@stripe/stripe-js';
import { Flex, Loader } from '@mantine/core';

import { useCheckout } from '@hooks/useCheckout';
import { useSubscribe } from '@hooks/useSubscribe';
import { NOTIFICATION_KEYS } from '@config';

import { notify } from '@libs/notify';
import { useAddCard } from '@hooks/useAddCard';
import { CheckoutContent } from './CheckoutContent';
import { PaymentMethodForm } from './PaymentMethodForm';
import { usePaymentMethods } from '@hooks/usePaymentMethods';

const { publicRuntimeConfig } = getConfig();

const stripePromise =
  publicRuntimeConfig.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
  loadStripe(publicRuntimeConfig.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export interface SelectCardModalContentProps {
  email: string;
  planCode: string;
  onClose: () => void;
}

function SelectCardModalContent({ email, planCode }: SelectCardModalContentProps) {
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
  });

  const stripe = useStripe();
  const elements = useElements();

  const { addPaymentMethod, isAddPaymentMethodLoading, setIsPaymentMethodLoading } = useAddCard({
    refetchPaymentMethods,
    handleProceed,
  });

  const handleAddCard = async () => {
    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) return;

    setIsPaymentMethodLoading(true);
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
    });

    if (paymentMethod) {
      addPaymentMethod(paymentMethod.id);
    }

    if (error) {
      notify(NOTIFICATION_KEYS.ERROR_ADDING_PAYMENT_METHOD, {
        title: 'Error adding card!',
        message: error.message || 'Something went wrong while adding card. Please try again later.',
        color: 'red',
      });
    }
  };

  return (
    <>
      {isPaymentMethodsLoading || isPaymentMethodsFetching ? (
        <Flex align="center" justify="center" style={{ minHeight: '200px' }}>
          <Loader />
        </Flex>
      ) : (
        <Flex gap={0}>
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
          />
        </Flex>
      )}
    </>
  );
}

export function SelectCardModal(props: SelectCardModalContentProps) {
  return (
    <Elements stripe={stripePromise}>
      <SelectCardModalContent {...props} />
    </Elements>
  );
}
