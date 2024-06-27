import { useState } from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { useQuery } from '@tanstack/react-query';
import { Flex, Loader, Divider, Title, Stack } from '@mantine/core';

import { notify } from '@libs/notify';
import { Button } from '@ui/button';
import { commonApi } from '@libs/api';
import { useCheckout } from '@hooks/useCheckout';
import { CheckoutDetails } from '../Checkout/CheckoutDetails';

import { ICardData, IErrorObject } from '@impler/shared';
import { API_KEYS, CONSTANTS, NOTIFICATION_KEYS, ROUTES } from '@config';
import { PaymentMethodGroup } from './PaymentMethods/PaymentMethodGroup';
import Coupon from './Coupon/Coupon';

const { publicRuntimeConfig } = getConfig();

interface SelectCardModalProps {
  email: string;
  planCode: string;
  onClose: () => void;
  paymentMethodId?: string;
}

export function SelectCardModal({ email, planCode, onClose, paymentMethodId }: SelectCardModalProps) {
  const router = useRouter();
  // const theme = useMantineTheme();

  const gatewayURL = publicRuntimeConfig.NEXT_PUBLIC_PAYMENT_GATEWAY_URL;
  const isCouponFeatureEnabled = publicRuntimeConfig.NEXT_PUBLIC_COUPON_ENABLED;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(paymentMethodId);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>();
  const {
    data: paymentMethods,
    isLoading: isPaymentMethodsLoading,
    isFetching: isPaymentMethodsFetching,
  } = useQuery<unknown, IErrorObject, ICardData[], [string]>(
    [API_KEYS.PAYMENT_METHOD_LIST],
    () => commonApi<ICardData[]>(API_KEYS.PAYMENT_METHOD_LIST as any, {}),
    {
      onSuccess(data) {
        if (data?.length === 0) {
          notify(NOTIFICATION_KEYS.NO_PAYMENT_METHOD_FOUND, {
            title: 'No Cards Found!',
            message: 'Please Add your Card first. Redirecting you to cards!',
            color: 'red',
          });
          modals.closeAll();
          router.push(ROUTES.ADD_CARD + `&${CONSTANTS.PLAN_CODE_QUERY_KEY}=${planCode}`);
        } else {
          setSelectedPaymentMethod(data[0].paymentMethodId);
        }
      },
    }
  );

  const { checkoutData, isCheckoutDataLoading } = useCheckout({
    couponCode: appliedCouponCode,
    paymentMethodId: selectedPaymentMethod,
    planCode,
  });

  const handleProceed = () => {
    modals.closeAll();
    onClose();
    if (selectedPaymentMethod) {
      let url =
        `${gatewayURL}/api/v1/plans/${planCode}/buy/${email}/redirect?paymentMethodId=${selectedPaymentMethod}`.replaceAll(
          '"',
          ''
        );

      if (appliedCouponCode) {
        url += `&couponCode=${appliedCouponCode}`;
      }

      window.location.href = url;
    }
  };
  const handlePaymentMethodChange = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

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

          <PaymentMethodGroup
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
