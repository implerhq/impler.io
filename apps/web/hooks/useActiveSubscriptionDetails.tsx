import { useQuery } from '@tanstack/react-query';
import { API_KEYS } from '@config';
import { IErrorObject, ISubscriptionData } from '@impler/shared';
import { usePlanMetaData } from 'store/planmeta.store.context';
import { useAppState } from 'store/app.context';
import { useSubOSIntegration } from './useSubOSIntegration';
import { IPlanMeta } from '@types';
import { subscriptionApi } from 'subos-frontend';
import { notify } from '@libs/notify';

interface UseActiveSubscriptionDetailProps {
  projectId?: string;
}

export function useActiveSubscriptionDetails({ projectId }: UseActiveSubscriptionDetailProps) {
  const subOSIntegration = useSubOSIntegration();
  const { profileInfo } = useAppState();
  const { meta, setPlanMeta } = usePlanMetaData();

  const {
    data: activePlanDetails,
    isLoading,
    error: subscriptionError,
    refetch: refetchActiveSubscriptionDetails,
  } = useQuery<unknown, IErrorObject, ISubscriptionData, [string | undefined]>(
    [API_KEYS.FETCH_ACTIVE_SUBSCRIPTION],
    async () => {
      const activeSubscription = await subscriptionApi.getActiveSubscription(profileInfo!.email);

      return activeSubscription?.data;
    },
    {
      enabled: !!projectId,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      onSuccess: (data) => {
        data?.meta && setPlanMeta(data.meta as IPlanMeta);
      },
      onError: (error) => {
        notify(String(error));
      },
    }
  );

  return {
    meta,
    activePlanDetails,
    isActivePlanLoading: isLoading || subOSIntegration.loading,
    subscriptionError: subscriptionError || subOSIntegration.error,
    refetchActivePlanDetails: refetchActiveSubscriptionDetails,
  };
}
