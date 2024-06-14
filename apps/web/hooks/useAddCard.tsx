import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { useRouter } from 'next/router';
import { IErrorObject } from '@impler/shared';
import { useLocalStorage } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { useStripe } from '@stripe/react-stripe-js';
import { API_KEYS, CONSTANTS, NOTIFICATION_KEYS, ROUTES } from '@config';
import { useState } from 'react';

interface UseAddCardProps {
  close: () => void;
  refetchPaymentMethods: () => void;
}

export function useAddCard({ close, refetchPaymentMethods }: UseAddCardProps) {
  const router = useRouter();
  const stripe = useStripe();
  const [isPaymentMethodLoading, setIsPaymentMethodLoading] = useState<boolean>(false);
  const [planCodeName] = useLocalStorage<string>({ key: CONSTANTS.PLAN_CODE_STORAGE_KEY });
  const { mutate: addPaymentMethod } = useMutation<any, IErrorObject, string>(
    [API_KEYS.ADD_PAYMENT_METHOD],
    async (paymentMethodId) =>
      commonApi(API_KEYS.ADD_PAYMENT_METHOD as any, {
        parameters: [paymentMethodId],
      }),
    {
      async onSuccess(data: any) {
        if (data && data.status === 'succeeded') {
          notify(NOTIFICATION_KEYS.CARD_ADDED);
          performReturnAction();
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
            await saveIntentId(data.intentId);
          }
        }
        refetchPaymentMethods();
        close();
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

  const saveIntentId = async (intentId: string) => {
    await commonApi(API_KEYS.SAVE_INTENT_ID as any, {
      parameters: [intentId],
    });
    refetchPaymentMethods();
    close();
    performReturnAction();
  };

  const performReturnAction = async () => {
    if (planCodeName) {
      router.push(ROUTES.HOME);
    }
  };

  return {
    performReturnAction,
    addPaymentMethod,
    isPaymentMethodLoading,
    setIsPaymentMethodLoading,
  };
}
