import { Flex, Loader, Divider, Title, Stack } from '@mantine/core';
import { Button } from '@ui/button';

import Coupon from './Coupon/Coupon';
import { useCheckout } from '@hooks/useCheckout';
import { CheckoutDetails } from '../Checkout/CheckoutDetails';
import { useSubscribe } from '@hooks/useSubscribe';
import { PaymentMethods } from './PaymentMethods/PaymentMethods';

interface SelectCardModalProps {
  email: string;
  planCode: string;
  onClose: () => void;
  paymentMethodId?: string;
}

export function SelectCardModal({ email, planCode, paymentMethodId }: SelectCardModalProps) {
  const {
    appliedCouponCode,
    setAppliedCouponCode,
    handlePaymentMethodChange,
    handleProceed,
    isCouponFeatureEnabled,
    isPaymentMethodsFetching,
    isPaymentMethodsLoading,
    selectedPaymentMethod,
    paymentMethods,
  } = useSubscribe({
    email,
    planCode,
    paymentMethodId,
  });

  const { checkoutData, isCheckoutDataLoading } = useCheckout({
    couponCode: appliedCouponCode,
    paymentMethodId: selectedPaymentMethod,
    planCode,
  });

  return (
    <>
      {isPaymentMethodsLoading || isPaymentMethodsFetching ? (
        <Flex w={480} align="center" justify="center" style={{ minHeight: '600px' }}>
          <Loader />
        </Flex>
      ) : (
        <>
          <Title fw="bolder" align="center" size={20}>
            Confirm Your Subscription
          </Title>
          <Divider my="sm" mt={10} />

          <PaymentMethods
            paymentMethods={paymentMethods}
            selectedPaymentMethod={selectedPaymentMethod}
            handlePaymentMethodChange={handlePaymentMethodChange}
          />

          <Stack spacing="lg" mt="md">
            {isCouponFeatureEnabled === 'true' ? (
              <Coupon planCode={planCode} couponCode={appliedCouponCode} setAppliedCouponCode={setAppliedCouponCode} />
            ) : null}

            <CheckoutDetails checkoutData={checkoutData} isCheckoutDataLoading={isCheckoutDataLoading} />

            <Button onClick={handleProceed} fullWidth mt="md">
              Confirm
            </Button>
          </Stack>
        </>
      )}
    </>
  );
}
