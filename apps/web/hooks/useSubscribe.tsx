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
}

interface ISubscribeResponse {
  url: string;
  status: string;
  success: boolean;
}

export const useSubscribe = ({ email, planCode }: UseSubscribeProps) => {
  const queryClient = useQueryClient();
  const isCouponFeatureEnabled = publicRuntimeConfig.NEXT_PUBLIC_COUPON_ENABLED;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>();
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | undefined>(undefined);

  const {
    data: paymentMethods,
    isLoading: isPaymentMethodsLoading,
    isFetching: isPaymentMethodsFetching,
  } = useQuery<ICardData[], IErrorObject, ICardData[], [string]>(
    [API_KEYS.PAYMENT_METHOD_LIST],
    () => commonApi<ICardData[]>(API_KEYS.PAYMENT_METHOD_LIST as any, {}),
    {
      onSuccess(data) {
        // If a new payment method is added, make it the default selection
        if (data?.length) {
          setSelectedPaymentMethod((prevMethod) => prevMethod || data[0].paymentMethodId);
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
          modals.close(MODAL_KEYS.PAYMENT_PLANS);
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

  const handleProceed = (createdPaymentMethodId?: string) => {
    console.log(createdPaymentMethodId, selectedPaymentMethod);
    if (selectedPaymentMethod) {
      subscribe({
        email,
        planCode,
        selectedPaymentMethod: createdPaymentMethodId || selectedPaymentMethod,
      });
    }
  };

  const handlePaymentMethodChange = (paymentMethod: string) => {
    setSelectedPaymentMethod(paymentMethod);
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
