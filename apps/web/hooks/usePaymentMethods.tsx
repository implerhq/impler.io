import { commonApi } from '@libs/api';
import { API_KEYS } from '@config';
import { ICardData, IErrorObject } from '@impler/shared';
import { useMutation, useQuery } from '@tanstack/react-query';

export function usePaymentMethods() {
  const { data: paymentMethods, isLoading: isPaymentMethodsLoading } = useQuery<
    unknown,
    IErrorObject,
    ICardData[],
    [string]
  >([API_KEYS.PAYMENT_METHOD_LIST], () => commonApi<ICardData[]>(API_KEYS.PAYMENT_METHOD_LIST as any, {}));

  const { mutate: deletePaymentMethod, isLoading: isDeletePaymentMethodLoading } = useMutation<
    ICardData,
    IErrorObject,
    string,
    (string | undefined)[]
  >([API_KEYS.PAYMENT_METHOD_DELETE], (paymentMethodId: string) =>
    commonApi<ICardData>(API_KEYS.PAYMENT_METHOD_DELETE as any, { parameters: [paymentMethodId] })
  );

  return {
    paymentMethods,
    deletePaymentMethod,
    isPaymentMethodsLoading,
    isDeletePaymentMethodLoading,
  };
}
