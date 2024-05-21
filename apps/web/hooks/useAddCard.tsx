import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { IErrorObject } from '@impler/shared';
import { useMutation } from '@tanstack/react-query';
import { useStripe } from '@stripe/react-stripe-js';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';

export function useAddCard() {
  const stripe = useStripe();

  const { mutate: addPaymentMethod, isLoading: isAddPaymentMethodLoading } = useMutation<any, IErrorObject, string>(
    [API_KEYS.ADD_PAYMENT_METHOD],
    async (paymentMethodId) =>
      commonApi(API_KEYS.ADD_PAYMENT_METHOD as any, {
        parameters: [paymentMethodId],
      }),
    {
      async onSuccess(data: any) {
        if (data && data.status === 'requires_action') {
          try {
            const response = await stripe?.confirmCardSetup(data.client_secret);
            if (response?.error?.type === 'invalid_request_error') {
              notify(NOTIFICATION_KEYS.ERROR_AUTHORIZING_PAYMENT_METHOD, {
                title: 'Error While Authorizing Payment',
                message: response?.error?.message || 'Error while saving payment method',
                color: 'red',
              });
            } else {
              await saveIntentId(data.intentId);
            }
          } catch (error) {}
        }
      },
    }
  );

  const saveIntentId = async (intentId: string) => {
    await commonApi(API_KEYS.SAVE_INTENT_ID as any, {
      parameters: [intentId],
    });
  };

  return {
    addPaymentMethod,
    isAddPaymentMethodLoading,
  };
}
