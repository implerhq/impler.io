/*
 * NOTE: Original implementation commented as requested.
 * import { useMutation } from '@tanstack/react-query';
 * import { commonApi } from '@libs/api';
 * import { API_KEYS, NOTIFICATION_KEYS } from '@config';
 * import { IErrorObject } from '@impler/shared';
 * import { notify } from '@libs/notify';
 * import * as subos from 'subos-frontend';
 * export function useUpdatePaymentMethod() {
 *   const { mutate: updatePaymentMethod, isLoading: isUpdatePaymentMethodLoading } = useMutation<
 *     any,
 *     IErrorObject,
 *     { paymentMethodId: string }
 *   >(
 *     [API_KEYS.UPDATE_SUBSCRIPTION_PAYMENT_METHOD],
 *     ({ paymentMethodId }) =>
 *       commonApi(API_KEYS.UPDATE_SUBSCRIPTION_PAYMENT_METHOD as any, {
 *         parameters: [paymentMethodId],
 *       }),
 *     {
 *       onSuccess(data) {
 *         if (data.success) {
 *           notify(NOTIFICATION_KEYS.PAYMENT_METHOD_UPDATED, {
 *             title: 'Payment Method Updated',
 *             message: data.message,
 *             color: 'green',
 *           });
 *         }
 *       },
 *       onError(error: IErrorObject) {
 *         notify(NOTIFICATION_KEYS.ERROR_UPDATING_PAYMENT_METHOD, {
 *           title: 'Error while updating payment method',
 *           message: error.message,
 *           color: 'red',
 *         });
 *       },
 *     }
 *   );
 *
 *   return {
 *     updatePaymentMethod,
 *     isUpdatePaymentMethodLoading,
 *   };
 * }
 */

// Replacement no-op stub to keep the app compiling
export function useUpdatePaymentMethod() {
  const updatePaymentMethod = () => {
    // intentionally no-op while original implementation is commented out
  };
  const isUpdatePaymentMethodLoading = false;

  return { updatePaymentMethod, isUpdatePaymentMethodLoading };
}
