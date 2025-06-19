/* eslint-disable multiline-comment-style */
import { useState } from 'react';
import { modals } from '@mantine/modals';
import { useStripe } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { IErrorObject } from '@impler/shared';
import { ConfirmationModal } from '@components/ConfirmationModal';
import { API_KEYS, CONSTANTS, NOTIFICATION_KEYS } from '@config';

interface UseAddCardProps {
  refetchPaymentMethods: () => void;
  handleProceed: (paymentMethodId: string) => void;
}

export function useAddCardAndSubscribe({ refetchPaymentMethods }: UseAddCardProps) {
  // const queryClient = useQueryClient();
  const stripe = useStripe();
  const [isPaymentMethodLoading, setIsPaymentMethodLoading] = useState<boolean>(false);

  const { mutate: addPaymentMethod, isLoading: isAddPaymentMethodLoading } = useMutation<
    any,
    IErrorObject,
    { planCode: string; paymentMethodId: string }
  >(
    [API_KEYS.PAYMENT_METHOD_ADD],
    async ({ paymentMethodId }) =>
      commonApi(API_KEYS.PAYMENT_METHOD_ADD as any, {
        parameters: [paymentMethodId],
      }),
    {
      async onSuccess(data: any, { paymentMethodId, planCode }) {
        console.log(data);
        notify(NOTIFICATION_KEYS.CARD_ADDED);

        createSubscription({
          planCode,
          paymentMethodId,
        });

        refetchPaymentMethods();
      },
      onError: (error: IErrorObject) => {
        notify(NOTIFICATION_KEYS.ADD_CARD_FAILED, {
          title: 'Failed to Add New Card in System',
          message: error.message,
          color: 'red',
        });
      },
    }
  );

  const { mutate: createSubscription, isLoading: isCreateSubscriptionLoaiding } = useMutation<
    ISubscribeResponse,
    IErrorObject,
    { planCode: string; paymentMethodId: string }
  >(
    [API_KEYS.SUBSCRIBE],
    async ({ planCode, paymentMethodId }) =>
      commonApi(API_KEYS.SUBSCRIBE as any, {
        query: { planCode, paymentMethodId },
      }),
    {
      async onSuccess(data: any, { paymentMethodId }) {
        let paymentResponse = null;

        if (data.setupIntentClientSecret) {
          paymentResponse = await stripe?.confirmCardSetup(data.setupIntentClientSecret, {
            payment_method: paymentMethodId,
          });

          console.log('Payment Response Is >>>', paymentResponse);
        }

        if (data.clientSecret) {
          paymentResponse = await stripe?.confirmCardPayment(data.clientSecret, {
            setup_future_usage: 'off_session',
            payment_method: paymentMethodId,
          });
        }
        /*
        if (paymentResponse?.paymentIntent?.status === CONSTANTS.PAYMENT_INTENT_SUCCCESS_CODE) {
          notify(NOTIFICATION_KEYS.MEMBERSHIP_PURCHASED, {
            title: 'Successfully Purchased Membership',
            message: 'Membership Activated',
            color: 'green',
          });

          modals.closeAll();
          modals.open({
            children: <ConfirmationModal status={paymentResponse.paymentIntent.status as string} />,
            withCloseButton: false,
          });

          modals.close(MODAL_KEYS.SELECT_CARD);
          modals.close(MODAL_KEYS.PAYMENT_PLANS);

          queryClient.invalidateQueries([API_KEYS.FETCH_ACTIVE_SUBSCRIPTION]);
        }

        */

        if (paymentResponse?.error) {
          notify(NOTIFICATION_KEYS.ERROR_ADDING_PAYMENT_METHOD, {
            title: 'Error Confirming Payment',
            message: paymentResponse?.error?.message || 'Error confirming payment',
            color: 'red',
          });
        }
      },
      onError: (error: IErrorObject) => {
        console.log('Geting error in useAddCardAndSubscribe as', error);
        setIsPaymentMethodLoading(false);
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

  return {
    addPaymentMethod,
    createSubscription,
    isPaymentMethodLoading,
    isAddPaymentMethodLoading,
    setIsPaymentMethodLoading,
    isCreateSubscriptionLoaiding,
  };
}
