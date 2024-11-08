import { useMutation } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';
import { notify } from '@libs/notify';

export function useUpdatePaymentMethod() {
  const { mutate: updatePaymentMethod, isLoading: isUpdatePaymentMethodLoading } = useMutation<
    any,
    IErrorObject,
    { paymentMethodId: string }
  >(
    [API_KEYS.UPDATE_SUBSCRIPTION_PAYMENT_METHOD],
    ({ paymentMethodId }) =>
      commonApi(API_KEYS.UPDATE_SUBSCRIPTION_PAYMENT_METHOD as any, {
        parameters: [paymentMethodId],
      }),
    {
      onSuccess(data) {
        if (data.success) {
          notify(NOTIFICATION_KEYS.PAYMENT_METHOD_UPDATED, {
            title: 'Payment Method Updated',
            message: data.message,
            color: 'green',
          });
        }
      },
      onError(error: IErrorObject) {
        notify(NOTIFICATION_KEYS.ERROR_UPDATING_PAYMENT_METHOD, {
          title: 'Error while updating payment method',
          message: error.message,
          color: 'red',
        });
      },
    }
  );

  return {
    updatePaymentMethod,
    isUpdatePaymentMethodLoading,
  };
}
