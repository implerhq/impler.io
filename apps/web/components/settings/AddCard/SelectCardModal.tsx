import { Flex, Loader, Divider, Title, Stack } from '@mantine/core';
import { Button } from '@ui/button';

import { Coupon } from './Coupon';
import { CheckoutDetails } from '../Checkout';
import { PaymentMethods } from './PaymentMethods';
import { useCheckout } from '@hooks/useCheckout';
import { useSubscribe } from '@hooks/useSubscribe';

interface SelectCardModalProps {
  email: string;
  planCode: string;
  onClose: () => void;
  paymentMethodId?: string;
}

export function SelectCardModal({ email, planCode, paymentMethodId }: SelectCardModalProps) {
  const {
    handleProceed,
    paymentMethods,
    appliedCouponCode,
    isPurchaseLoading,
    setAppliedCouponCode,
    selectedPaymentMethod,
    isCouponFeatureEnabled,
    isPaymentMethodsFetching,
    isPaymentMethodsLoading,
    handlePaymentMethodChange,
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
            isAddCardDisabled={isPurchaseLoading}
            selectedPaymentMethod={selectedPaymentMethod}
            handlePaymentMethodChange={handlePaymentMethodChange}
          />

          <Stack spacing="lg" mt="md">
            {isCouponFeatureEnabled === 'true' ? (
              <Coupon planCode={planCode} couponCode={appliedCouponCode} setAppliedCouponCode={setAppliedCouponCode} />
            ) : null}

            <CheckoutDetails checkoutData={checkoutData} isCheckoutDataLoading={isCheckoutDataLoading} />

            <Button onClick={handleProceed} fullWidth mt="md" loading={isPurchaseLoading}>
              {isPurchaseLoading ? 'Processing...' : 'Confirm'}
            </Button>
          </Stack>
        </>
      )}
    </>
  );
}
