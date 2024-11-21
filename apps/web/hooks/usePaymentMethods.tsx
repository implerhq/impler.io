import { useMutation, useQuery } from '@tanstack/react-query';

import { notify } from '@libs/notify';
import { commonApi } from '@libs/api';
import { ICardData, IErrorObject } from '@impler/shared';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';

export function usePaymentMethods() {
  const {
    data: paymentMethods,
    refetch: refetchPaymentMethods,
    isFetching: isPaymentMethodsLoading,
    isFetched: isPaymentMethodsFetched,
  } = useQuery<unknown, IErrorObject, ICardData[], [string | undefined]>([API_KEYS.PAYMENT_METHOD_LIST], () =>
    commonApi<ICardData[]>(API_KEYS.PAYMENT_METHOD_LIST as any, {})
  );

  const { mutate: deletePaymentMethod, isLoading: isDeletePaymentMethodLoading } = useMutation<
    ICardData,
    IErrorObject,
    string,
    (string | undefined)[]
  >(
    [API_KEYS.PAYMENT_METHOD_DELETE],
    (paymentMethodId: string) =>
      commonApi<ICardData>(API_KEYS.PAYMENT_METHOD_DELETE as any, { parameters: [paymentMethodId] }),
    {
      onSuccess: () => {
        notify(NOTIFICATION_KEYS.CARD_REMOVED);
        refetchPaymentMethods();
      },
    }
  );

  return {
    paymentMethods,
    deletePaymentMethod,
    refetchPaymentMethods,
    isPaymentMethodsFetched,
    isPaymentMethodsLoading,
    isDeletePaymentMethodLoading,
  };
}
