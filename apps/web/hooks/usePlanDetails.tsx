import { useQuery } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';

export function usePlanDetails(profile: IProfileData) {
  console.log(profile);
  const { data } = useQuery<unknown, IErrorObject, ISubscriptionData, [string]>(
    [API_KEYS.FETCH_ACTIVE_SUBSCRIPTION],
    () =>
      commonApi<unknown>(API_KEYS.FETCH_ACTIVE_SUBSCRIPTION as any, {
        baseUrl: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL,
        headers: {
          auth: 'auth',
        },
        parameters: [profile.email],
      })
  );

  console.log('data from the hook yeah', data);

  return data;
}
