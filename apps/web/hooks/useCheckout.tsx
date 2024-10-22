import { API_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { IErrorObject } from '@impler/shared';
import { useMutation } from '@tanstack/react-query';

interface UseCheckoutProps {
  planCode: string;
  couponCode?: string;
}

export function useCheckout({ couponCode, planCode }: UseCheckoutProps) {
  const {
    mutate: getCheckoutData,
    data: checkoutData,
    isLoading: isCheckoutDataLoading,
  } = useMutation<ICheckoutData, IErrorObject, string | undefined, (string | undefined)[]>(
    [API_KEYS.CHECKOUT, couponCode, planCode],
    (paymentMethodId) => commonApi(API_KEYS.CHECKOUT as any, { query: { couponCode, planCode, paymentMethodId } })
  );

  return {
    checkoutData,
    getCheckoutData,
    isCheckoutDataLoading,
  };
}
