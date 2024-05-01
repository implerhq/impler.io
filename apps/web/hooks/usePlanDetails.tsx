import { useQuery } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';

interface UsePlanDetailProps {
  email: string;
}

export function usePlanDetails({ email }: UsePlanDetailProps) {
  const { data: activePlanDetails, isLoading: isActivePlanLoading } = useQuery<
    unknown,
    IErrorObject,
    ISubscriptionData,
    [string, string]
  >(
    [API_KEYS.FETCH_ACTIVE_SUBSCRIPTION, email],
    () => commonApi<ISubscriptionData>(API_KEYS.FETCH_ACTIVE_SUBSCRIPTION as any, {}),
    {
      enabled: !!email,
    }
  );

  return {
    activePlanDetails,
    isActivePlanLoading,
  };
}
