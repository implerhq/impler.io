import { useMutation } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';
import { useStripe } from '@stripe/react-stripe-js';
import { notify } from '@libs/notify';

export function useUpdateUser() {
  const stripe = useStripe();

  const { mutate: addPaymentMethod, isLoading: isAddPaymentMethodLoading } = useMutation<any, IErrorObject, string>(
    [API_KEYS.UPDATE_PAYMENT_INTENT],
    async (paymentMethodId) =>
      commonApi(API_KEYS.UPDATE_PAYMENT_INTENT as any, {
        parameters: [paymentMethodId],
      }),
    {
      async onSuccess(data: any) {
        console.log(data);
        if (data && data.status === 'requires_action') {
          try {
            const response = await stripe?.confirmCardSetup(data.client_secret);
            console.log('Response iss:', response);
            if (response?.error?.type === 'invalid_request_error') {
              handleInvalidRequestError(data.paymentMethodId);
            }
          } catch (error) {
            console.log('Error confirming card setup:', error);
          }
        }
      },
    }
  );

  const handleInvalidRequestError = async (paymentMethodId: string) => {
    console.log('payment method id is', paymentMethodId);
    try {
      await commonApi(API_KEYS.SAVE_PAYMENT_INTENT_ID as any, {
        parameters: [paymentMethodId],
      });
      notify(NOTIFICATION_KEYS.PAYMENT_INTENT_ID_UPDATED, {
        title: 'Payment Method Updated',
        message: `Your Payment Method has been Updated. Your Current Payment Method has been updated.`,
        color: 'red',
      });
    } catch (error) {
      console.error('Error handling payment intent update:', error);
      // Handle error if necessary
    }
  };

  return {
    addPaymentMethod,
    isAddPaymentMethodLoading,
  };
}
