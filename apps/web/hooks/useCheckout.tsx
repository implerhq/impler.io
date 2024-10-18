import { API_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { IErrorObject } from '@impler/shared';
import { useQuery } from '@tanstack/react-query';

interface UseCheckoutProps {
  planCode: string;
  couponCode?: string;
  paymentMethodId?: string;
}

export function useCheckout({ couponCode, planCode }: UseCheckoutProps) {
  const { data: checkoutData, isLoading: isCheckoutDataLoading } = useQuery<
    unknown,
    IErrorObject,
    ICheckoutData,
    (string | undefined)[]
  >(
    [API_KEYS.CHECKOUT, couponCode, planCode],
    () => commonApi(API_KEYS.CHECKOUT as any, { query: { couponCode, planCode } }),
    {
      enabled: !!planCode,
    }
  );

  return {
    checkoutData,
    isCheckoutDataLoading,
  };
}
