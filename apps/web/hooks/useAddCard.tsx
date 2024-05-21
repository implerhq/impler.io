import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { IErrorObject } from '@impler/shared';
import { useMutation } from '@tanstack/react-query';
import { useStripe } from '@stripe/react-stripe-js';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';

interface UseAddCardProps {
  close: () => void;
  refetchPaymentMethods: () => void;
}

export function useAddCard({ close, refetchPaymentMethods }: UseAddCardProps) {
  const stripe = useStripe();

  const { mutate: addPaymentMethod, isLoading: isAddPaymentMethodLoading } = useMutation<any, IErrorObject, string>(
    [API_KEYS.ADD_PAYMENT_METHOD],
    async (paymentMethodId) =>
      commonApi(API_KEYS.ADD_PAYMENT_METHOD as any, {
        parameters: [paymentMethodId],
      }),
    {
      async onSuccess(data: any) {
        console.log('Payment adding data', data);
        if (data && data.status === 'succeeded') {
          notify(NOTIFICATION_KEYS.PAYMENT_METHOD_ADDED, {
            title: 'Payment Method Added',
            message: 'Your Payment Method has been added successfully.',
            color: 'green',
          });
        }

        if (data && data.status === 'requires_action') {
          const response = await stripe?.confirmCardSetup(data.client_secret);
          if (response?.error?.type === 'invalid_request_error') {
            notify(NOTIFICATION_KEYS.ERROR_AUTHORIZING_PAYMENT_METHOD, {
              title: 'Error While Authorizing Payment',
              message: response?.error?.message || 'Error while saving payment method',
              color: 'red',
            });
          } else {
            notify(NOTIFICATION_KEYS.PAYMENT_METHOD_ADDED, {
              title: 'Payment method added successfully',
              message: 'Payment method added successfully. ',
              color: 'green',
            });
            await saveIntentId(data.intentId);
          }
        }
        refetchPaymentMethods();
        close();

        /*
         * notify(NOTIFICATION_KEYS.ERROR_AUTHORIZING_PAYMENT_METHOD, {
         *   title: 'Error While Authorizing Payment',
         *   message: response?.error?.message || 'Error while saving payment method',
         *   color: 'red',
         * });
         */
      },
      onError(error: any) {
        console.log(error);
      },
    }
  );

  const saveIntentId = async (intentId: string) => {
    await commonApi(API_KEYS.SAVE_INTENT_ID as any, {
      parameters: [intentId],
    });
    refetchPaymentMethods();
    close();
  };

  return {
    addPaymentMethod,
    isAddPaymentMethodLoading,
  };
}
