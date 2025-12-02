import { useQuery } from '@tanstack/react-query';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';
import { IErrorObject, ISubscriptionData } from '@impler/shared';
import { usePlanMetaData } from 'store/planmeta.store.context';
import { commonApi } from '@libs/api';
import { useSubOSIntegration } from './useSubOSIntegration';
import { IPlanMeta } from '@types';
import { notify } from '@libs/notify';

interface UseActiveSubscriptionDetailProps {
  projectId?: string;
}

export function useActiveSubscriptionDetails({ projectId }: UseActiveSubscriptionDetailProps) {
  const subOSIntegration = useSubOSIntegration();
  const { meta, setPlanMeta } = usePlanMetaData();

  const {
    data: activePlanDetails,
    isLoading,
    error: subscriptionError,
    refetch: refetchActiveSubscriptionDetails,
  } = useQuery<unknown, IErrorObject, ISubscriptionData, [string | undefined]>(
    [API_KEYS.FETCH_ACTIVE_SUBSCRIPTION],
    async () => {
      return await commonApi(API_KEYS.FETCH_ACTIVE_SUBSCRIPTION as any, {});
    },
    {
      enabled: !!projectId,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      onSuccess: (data) => {
        data?.meta && setPlanMeta(data.meta as IPlanMeta);

        return data.meta as IPlanMeta;
      },
      onError: () => {
        notify(NOTIFICATION_KEYS.ERROR_FETCHING_SUBSCRIPTION_DETAILS, {
          title: 'Failed to load subscription details',
          message: 'An error occurred while loading subscription details',
          color: 'red',
        });
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
