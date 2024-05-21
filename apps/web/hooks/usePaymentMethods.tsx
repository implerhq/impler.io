import { commonApi } from '@libs/api';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';
import { ICardData, IErrorObject } from '@impler/shared';
import { useMutation, useQuery } from '@tanstack/react-query';
import { notify } from '@libs/notify';

export function usePaymentMethods() {
  const {
    data: paymentMethods,
    refetch: refetchPaymentMethods,
    isLoading: isPaymentMethodsLoading,
    isFetched: isPaymentMethodsFetched,
  } = useQuery<unknown, IErrorObject, ICardData[], [string]>([API_KEYS.PAYMENT_METHOD_LIST], () =>
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
        notify(NOTIFICATION_KEYS.PAYMENT_METHOD_DELETED, {
          title: 'Card Deleted',
          message: 'Card deleted successfully',
          color: 'red',
        });
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
