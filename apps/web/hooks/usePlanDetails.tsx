import { useQuery } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';
import getConfig from 'next/config';

interface UsePlanDetailProps {
  email: string;
}

const { publicRuntimeConfig } = getConfig();
const authKey = publicRuntimeConfig.NEXT_PUBLIC_PAYMENT_GATEWAY_AUTH_HEADER_KEY;
const authValue = publicRuntimeConfig.NEXT_PUBLIC_PAYMENT_GATEWAY_AUTH_HEADER_VALUE;

export function usePlanDetails({ email }: UsePlanDetailProps) {
  const { data } = useQuery<unknown, IErrorObject, ISubscriptionData, [string, string]>(
    [API_KEYS.FETCH_ACTIVE_SUBSCRIPTION, email],
    () =>
      commonApi<ISubscriptionData>(API_KEYS.FETCH_ACTIVE_SUBSCRIPTION as any, {
        baseUrl: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL,
        headers: {
          [authKey]: authValue,
        },
        parameters: [email],
      })
  );

  return data;
}
