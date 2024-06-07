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
            await stripe?.confirmCardSetup(data.client_secret);

            notify(NOTIFICATION_KEYS.PAYMENT_METHOD_ADDED, {
              title: 'Payment method added successfully',
              message: 'Your payment method has been added successfully. ',
              color: 'green',
            });
            await saveIntentId(data.intentId);
          }
        }
        refetchPaymentMethods();
        close();
      },
      onError(error: any) {
        notify(NOTIFICATION_KEYS.ERROR_ADDING_PAYMENT_METHOD, {
          title: 'Error while adding payment method',
          message: error,
          color: 'red',
        });
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
