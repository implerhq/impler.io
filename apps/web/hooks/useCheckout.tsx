import { API_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { IErrorObject } from '@impler/shared';
import { useQuery } from '@tanstack/react-query';

interface UseCheckoutProps {
  planCode: string;
  couponCode?: string;
  paymentMethodId?: string;
}

export function useCheckout({ couponCode, planCode, paymentMethodId }: UseCheckoutProps) {
  const { data: checkoutData, isLoading: isCheckoutDataLoading } = useQuery<
    unknown,
    IErrorObject,
    ICheckoutData,
    (string | undefined)[]
  >(
    [API_KEYS.CHECKOUT, couponCode, planCode, paymentMethodId],
    () => commonApi(API_KEYS.CHECKOUT as any, { query: { couponCode, planCode, paymentMethodId } }),
    {
      enabled: !!paymentMethodId && !!planCode,
    }
  );

  return {
    checkoutData,
    isCheckoutDataLoading,
  };
}
