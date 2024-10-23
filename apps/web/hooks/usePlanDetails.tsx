import { useQuery } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';
import { usePlanMetaData } from 'store/planmeta.store.context';

interface UsePlanDetailProps {
  projectId: string;
}

export function usePlanDetails({ projectId }: UsePlanDetailProps) {
  const { meta, setPlanMeta } = usePlanMetaData();
  const {
    data: activePlanDetails,
    isLoading: isActivePlanLoading,
    refetch: refetchActivePlanDetails,
  } = useQuery<unknown, IErrorObject, ISubscriptionData, [string, string]>(
    [API_KEYS.FETCH_ACTIVE_SUBSCRIPTION, projectId],
    () =>
      commonApi<ISubscriptionData>(API_KEYS.FETCH_ACTIVE_SUBSCRIPTION as any, {
        parameters: [projectId],
      }),
    {
      onSuccess(data) {
        if (data && data.meta) {
          setPlanMeta({
            ...data.meta,
          });
        }
      },
      enabled: !!projectId,
    }
  );

  return {
    meta,
    activePlanDetails,
    isActivePlanLoading,
    refetchActivePlanDetails,
  };
}
