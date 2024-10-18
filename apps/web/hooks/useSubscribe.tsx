import { useState } from 'react';
import getConfig from 'next/config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notify } from '@libs/notify';
import { commonApi } from '@libs/api';
import { API_KEYS, CONSTANTS, MODAL_KEYS, NOTIFICATION_KEYS } from '@config';
import { modals } from '@mantine/modals';
import { ICardData, IErrorObject } from '@impler/shared';
import { ConfirmationModal } from '@components/ConfirmationModal';

const { publicRuntimeConfig } = getConfig();

interface UseSubscribeProps {
  email: string;
  planCode: string;
  paymentMethodId?: string;
}

interface ISubscribeResponse {
  url: string;
  status: string;
  success: boolean;
}

export const useSubscribe = ({ email, planCode, paymentMethodId }: UseSubscribeProps) => {
  const queryClient = useQueryClient();
  const isCouponFeatureEnabled = publicRuntimeConfig.NEXT_PUBLIC_COUPON_ENABLED;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(paymentMethodId);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | undefined>(undefined);

  const {
    data: paymentMethods,
    isLoading: isPaymentMethodsLoading,
    isFetching: isPaymentMethodsFetching,
  } = useQuery<unknown, IErrorObject, ICardData[], [string]>(
    [API_KEYS.PAYMENT_METHOD_LIST],
    () => commonApi<ICardData[]>(API_KEYS.PAYMENT_METHOD_LIST as any, {}),
    {
      onSuccess(data) {
        if (data?.length) {
          setSelectedPaymentMethod(data[0].paymentMethodId);
        } else {
          return;
        }
      },
    }
  );
  const { mutate: subscribe, isLoading: isPurchaseLoading } = useMutation<
    ISubscribeResponse,
    IErrorObject,
    ISubscribeData
  >(
    [API_KEYS.SUBSCRIBE, selectedPaymentMethod, email, planCode],
    () =>
      commonApi<ISubscribeResponse>(API_KEYS.SUBSCRIBE as any, {
        query: { paymentMethodId: selectedPaymentMethod, email, planCode },
      }),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries([API_KEYS.FETCH_ACTIVE_SUBSCRIPTION, email]);
        if (response && response.status) {
          modals.open({
            title:
              response.status === CONSTANTS.PAYMENT_SUCCCESS_CODE
                ? CONSTANTS.SUBSCRIPTION_ACTIVATED_TITLE
                : CONSTANTS.SUBSCRIPTION_FAILED_TITLE,
            children: <ConfirmationModal status={response.status as string} />,
          });

          modals.close(MODAL_KEYS.SELECT_CARD);
        }
      },
      onError: (error: IErrorObject) => {
        notify(NOTIFICATION_KEYS.PURCHASE_FAILED, {
          title: 'Purchase Failed',
          message: error.message,
          color: 'red',
        });
        queryClient.invalidateQueries([API_KEYS.FETCH_ACTIVE_SUBSCRIPTION, email]);
        if (error && error.statusCode) {
          modals.open({
            title: CONSTANTS.SUBSCRIPTION_FAILED_TITLE,
            children: <ConfirmationModal status={String(error.statusCode)} />,
          });
        }
      },
    }
  );

  const handleProceed = () => {
    if (selectedPaymentMethod) {
      subscribe({
        email,
        planCode,
        selectedPaymentMethod,
      });
    }
  };

  const handlePaymentMethodChange = (paymnentMethodId: string) => {
    setSelectedPaymentMethod(paymnentMethodId);
  };

  return {
    paymentMethods,
    isPaymentMethodsFetching,
    isPaymentMethodsLoading,
    handleProceed,
    handlePaymentMethodChange,
    appliedCouponCode,
    setAppliedCouponCode,
    selectedPaymentMethod,
    isPurchaseLoading,
    isCouponFeatureEnabled,
  };
};
