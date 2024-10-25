import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { commonApi } from '@libs/api';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';
import { notify } from '@libs/notify';

export function useUpdatePaymentMethod() {
  const [updatedPaymentMethodId, setUpdatedPaymentMethodId] = useState<string | undefined>(undefined);

  const { mutate: updatePaymentMethod, isLoading: isUpdatePaymentMethodLoading } = useMutation<
    any,
    IErrorObject,
    { paymentMethodId: string; email: string }
  >(
    [API_KEYS.UPDATE_PAYMENT_METHOD],
    async ({ paymentMethodId, email }) =>
      commonApi(API_KEYS.UPDATE_PAYMENT_METHOD as any, {
        parameters: [paymentMethodId, email],
      }),
    {
      onSuccess() {
        setUpdatedPaymentMethodId(updatedPaymentMethodId);
        notify(NOTIFICATION_KEYS.PAYMENT_METHOD_UPDATED, {
          title: 'Payment Method Updated',
          message: 'Your payment method has been successfully updated.',
          color: 'green',
        });
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
    updatedPaymentMethodId,
  };
}
