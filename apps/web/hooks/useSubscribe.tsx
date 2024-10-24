import { useState } from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { notify } from '@libs/notify';
import { commonApi } from '@libs/api';
import { ICardData, IErrorObject } from '@impler/shared';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { API_KEYS, CONSTANTS, NOTIFICATION_KEYS, ROUTES } from '@config';
import { useAppState } from 'store/app.context';

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
  const router = useRouter();
  const queryClient = useQueryClient();
  const { profileInfo } = useAppState();
  const isCouponFeatureEnabled = publicRuntimeConfig.NEXT_PUBLIC_COUPON_ENABLED;
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | undefined>(undefined);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(paymentMethodId);

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
        queryClient.invalidateQueries([API_KEYS.FETCH_ACTIVE_SUBSCRIPTION, profileInfo?._projectId]);
        modals.closeAll();
        if (response && response.status) {
          modals.open({
            title:
              response.status === CONSTANTS.PAYMENT_SUCCCESS_CODE
                ? CONSTANTS.SUBSCRIPTION_ACTIVATED_TITLE
                : CONSTANTS.SUBSCRIPTION_FAILED_TITLE,
            children: <ConfirmationModal status={response.status as string} />,
          });
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
