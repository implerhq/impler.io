import { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { IErrorObject } from '@impler/shared';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';

interface UseSimpleAddCardProps {
  refetchPaymentMethods: () => void;
}

export function useAddCard({ refetchPaymentMethods }: UseSimpleAddCardProps) {
  const stripe = useStripe();
  const [isPaymentMethodLoading, setIsPaymentMethodLoading] = useState<boolean>(false);

  const { mutate: addPaymentMethod, isLoading: isAddPaymentMethodLoading } = useMutation<any, IErrorObject, string>(
    [API_KEYS.ADD_PAYMENT_METHOD],
    async (paymentMethodId) =>
      commonApi(API_KEYS.ADD_PAYMENT_METHOD as any, {
        parameters: [paymentMethodId],
      }),
    {
      async onSuccess(data: any) {
        if (data && data.status === 'succeeded') {
          notify(NOTIFICATION_KEYS.CARD_ADDED);
          refetchPaymentMethods();
        }

        if (data && data.status === 'requires_action') {
          const response = await stripe?.confirmCardSetup(data.client_secret);
          if (response?.error) {
            notify(NOTIFICATION_KEYS.ERROR_AUTHORIZING_PAYMENT_METHOD, {
              title: 'Error While Authorizing Card',
              message: response.error.message || 'Error while saving card',
              color: 'red',
            });
          } else {
            await stripe?.confirmCardSetup(data.client_secret);
            notify(NOTIFICATION_KEYS.CARD_ADDED);
            saveIntentId(data.intentId);
          }
        }
      },
      onError(error: any) {
        notify(NOTIFICATION_KEYS.ERROR_ADDING_PAYMENT_METHOD, {
          title: 'Error while adding card',
          message: error.message,
          color: 'red',
        });
        setIsPaymentMethodLoading(false);
      },
    }
  );

  const saveIntentId = async (intentId: string) => {
    await commonApi(API_KEYS.SAVE_INTENT_ID as any, {
      parameters: [intentId],
    });

    refetchPaymentMethods();
  };

  return {
    addPaymentMethod,
    isPaymentMethodLoading,
    setIsPaymentMethodLoading,
    isAddPaymentMethodLoading,
  };
}
