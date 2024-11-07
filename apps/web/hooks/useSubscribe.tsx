import { useState } from 'react';
import getConfig from 'next/config';
import { modals } from '@mantine/modals';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { notify } from '@libs/notify';
import { commonApi } from '@libs/api';
import { ICardData, IErrorObject } from '@impler/shared';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { API_KEYS, CONSTANTS, MODAL_KEYS, NOTIFICATION_KEYS } from '@config';

const { publicRuntimeConfig } = getConfig();

interface UseSubscribeProps {
  email: string;
  planCode: string;
}

interface ISubscribeResponse {
  url: string;
  status: string;
  success: boolean;
}

export const useSubscribe = ({ email, planCode }: UseSubscribeProps) => {
  const queryClient = useQueryClient();
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
      onSuccess: (response) => {
        queryClient.invalidateQueries([API_KEYS.FETCH_ACTIVE_SUBSCRIPTION]);
        modals.closeAll();
        if (response && response.status) {
          modals.open({
            children: <ConfirmationModal status={response.status as string} />,
            withCloseButton: false,
          });

          modals.close(MODAL_KEYS.SELECT_CARD);
          modals.close(MODAL_KEYS.PAYMENT_PLANS);
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
  };
};
