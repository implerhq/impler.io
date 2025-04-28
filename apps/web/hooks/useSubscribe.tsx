import { useState } from 'react';
import getConfig from 'next/config';
import { modals } from '@mantine/modals';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { notify } from '@libs/notify';
import { commonApi } from '@libs/api';
import { ICardData, IErrorObject } from '@impler/shared';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { API_KEYS, CONSTANTS, MODAL_KEYS, NOTIFICATION_KEYS } from '@config';
import { useStripe } from '@stripe/react-stripe-js';

const { publicRuntimeConfig } = getConfig();

interface UseSubscribeProps {
  email: string;
  planCode: string;
}

export const useSubscribe = ({ email, planCode }: UseSubscribeProps) => {
  const queryClient = useQueryClient();
  const stripe = useStripe();
  const isCouponFeatureEnabled = publicRuntimeConfig.NEXT_PUBLIC_COUPON_ENABLED;
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | undefined>(undefined);

  const {
    data: paymentMethods,
    isLoading: isPaymentMethodsLoading,
    isFetching: isPaymentMethodsFetching,
  } = useQuery<ICardData[], IErrorObject, ICardData[], [string]>([API_KEYS.PAYMENT_METHOD_LIST], () =>
    commonApi<ICardData[]>(API_KEYS.PAYMENT_METHOD_LIST as any, {})
  );

  const { mutate: subscribe, isLoading: isPurchaseLoading } = useMutation<
    ISubscribeResponse,
    IErrorObject,
    ISubscribeData
  >(
    [API_KEYS.SUBSCRIBE, email, planCode],
    (paymentData) =>
      commonApi<ISubscribeResponse>(API_KEYS.SUBSCRIBE as any, {
        query: { ...paymentData },
      }),
    {
      async onSuccess(response, { paymentMethodId }) {
        if (response.success) {
          queryClient.invalidateQueries([API_KEYS.FETCH_ACTIVE_SUBSCRIPTION]);
          modals.closeAll();
          modals.open({
            children: <ConfirmationModal status={CONSTANTS.PAYMENT_INTENT_SUCCCESS_CODE} />,
            withCloseButton: false,
          });

          return;
        }
        queryClient.invalidateQueries([API_KEYS.FETCH_ACTIVE_SUBSCRIPTION]);

        const paymentResponse = await stripe?.confirmCardPayment(response.clientSecret, {
          payment_method: paymentMethodId,
          setup_future_usage: 'off_session',
        });

        if (paymentResponse?.error && paymentResponse.error.payment_intent?.id) {
          paymentIntentFailed({ paymentIntentId: paymentResponse.error.payment_intent?.id });
        }

        modals.closeAll();
        if (paymentResponse?.paymentIntent?.status === CONSTANTS.PAYMENT_INTENT_SUCCCESS_CODE) {
          modals.open({
            children: <ConfirmationModal status={paymentResponse.paymentIntent.status as string} />,
            withCloseButton: false,
          });

          modals.close(MODAL_KEYS.SELECT_CARD);
          modals.close(MODAL_KEYS.PAYMENT_PLANS);
          queryClient.invalidateQueries([API_KEYS.FETCH_ACTIVE_SUBSCRIPTION]);
        }
      },
      onError: (error: IErrorObject) => {
        modals.closeAll();
        notify(NOTIFICATION_KEYS.PURCHASE_FAILED, {
          title: 'Purchase Failed',
          message: error.message,
          color: 'red',
        });
        if (error && error.statusCode) {
          modals.open({
            title: CONSTANTS.SUBSCRIPTION_FAILED_TITLE,
            children: <ConfirmationModal status={String(error.statusCode)} />,
          });
        }
        queryClient.invalidateQueries([API_KEYS.FETCH_ACTIVE_SUBSCRIPTION]);
      },
    }
  );

  const { mutate: paymentIntentFailed, isLoading: isPaymentIntentFailedLoading } = useMutation<
    any,
    IErrorObject,
    { paymentIntentId: string }
  >(
    [API_KEYS.PAYMENT_INTENT_FAILED],

    ({ paymentIntentId }) =>
      commonApi<any>(API_KEYS.PAYMENT_INTENT_FAILED as any, {
        parameters: [paymentIntentId],
      }),
    {
      async onSuccess(response) {
        if (response.success) {
          queryClient.invalidateQueries([API_KEYS.FETCH_ACTIVE_SUBSCRIPTION]);
          modals.closeAll();
          modals.open({
            children: <ConfirmationModal status={CONSTANTS.PAYMENT_FAILED_CODE} />,
            withCloseButton: true,
          });

          return;
        }
        queryClient.invalidateQueries([API_KEYS.FETCH_ACTIVE_SUBSCRIPTION]);
        modals.closeAll();
        modals.close(MODAL_KEYS.SELECT_CARD);
        modals.close(MODAL_KEYS.PAYMENT_PLANS);
        queryClient.invalidateQueries([API_KEYS.FETCH_ACTIVE_SUBSCRIPTION]);
      },
    }
  );

  const handleProceed = (createdPaymentMethodId: string) => {
    if (createdPaymentMethodId) {
      subscribe({
        email,
        planCode,
        paymentMethodId: createdPaymentMethodId,
      });
    }
  };

  return {
    handleProceed,
    paymentMethods,
    isPurchaseLoading,
    appliedCouponCode,
    setAppliedCouponCode,
    isCouponFeatureEnabled,
    isPaymentMethodsLoading,
    isPaymentMethodsFetching,
    isPaymentIntentFailedLoading,
  };
};
