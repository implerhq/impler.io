import { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { IErrorObject } from '@impler/shared';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';

interface UseAddCardProps {
  refetchPaymentMethods: () => void;
  handleProceed: (paymentMethodId: string) => void;
}

export function useAddCard({ refetchPaymentMethods, handleProceed }: UseAddCardProps) {
  const stripe = useStripe();
  const [isPaymentMethodLoading, setIsPaymentMethodLoading] = useState<boolean>(false);

  const { mutate: addPaymentMethod, isLoading: isAddPaymentMethodLoading } = useMutation<any, IErrorObject, string>(
    [API_KEYS.ADD_PAYMENT_METHOD],
    async (paymentMethodId) =>
      commonApi(API_KEYS.ADD_PAYMENT_METHOD as any, {
        parameters: [paymentMethodId],
      }),
    {
      async onSuccess(data: any, paymentMethodId) {
        if (data && data.status === 'succeeded') {
          notify(NOTIFICATION_KEYS.CARD_ADDED);
          handleProceed(paymentMethodId);
          refetchPaymentMethods();
        }

        if (data && data.status === 'requires_action') {
          const response = await stripe?.confirmCardSetup(data.client_secret);
          if (response?.error?.type === 'invalid_request_error') {
            notify(NOTIFICATION_KEYS.ERROR_AUTHORIZING_PAYMENT_METHOD, {
              title: 'Error While Authorizing Card',
              message: response?.error?.message || 'Error while saving card',
              color: 'red',
            });
          } else {
            await stripe?.confirmCardSetup(data.client_secret);

            notify(NOTIFICATION_KEYS.CARD_ADDED);
            saveIntentId(data.intentId, paymentMethodId);
          }
        }
      },
      onError(error: any) {
        notify(NOTIFICATION_KEYS.ERROR_ADDING_PAYMENT_METHOD, {
          title: 'Error while adding card',
          message: error,
          color: 'red',
        });
        setIsPaymentMethodLoading(false);
      },
    }
  );

  const saveIntentId = async (intentId: string, paymentMethodId: string) => {
    await commonApi(API_KEYS.SAVE_INTENT_ID as any, {
      parameters: [intentId],
    });
    refetchPaymentMethods();
    handleProceed(paymentMethodId);
  };

  return {
    addPaymentMethod,
    isPaymentMethodLoading,
    setIsPaymentMethodLoading,
    isAddPaymentMethodLoading,
  };
}
