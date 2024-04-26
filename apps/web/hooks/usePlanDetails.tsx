import { useQuery } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';

interface UsePlanDetailProps {
  email: string;
}

export function usePlanDetails({ email }: UsePlanDetailProps) {
  const { data } = useQuery<unknown, IErrorObject, ISubscriptionData, [string]>(
    [API_KEYS.FETCH_ACTIVE_SUBSCRIPTION],
    () =>
      commonApi<unknown>(API_KEYS.FETCH_ACTIVE_SUBSCRIPTION as any, {
        baseUrl: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL,
        headers: {
          auth: 'auth',
        },
        parameters: [email],
      })
  );

  return data;
}
