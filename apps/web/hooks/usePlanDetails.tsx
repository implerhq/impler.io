import { useQuery } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';
import { usePlanMetaData } from 'store/planmeta.store.context';

interface UsePlanDetailProps {
  email: string;
}

export function usePlanDetails({ email }: UsePlanDetailProps) {
  const { meta, setPlanMeta } = usePlanMetaData();
  const { data: activePlanDetails, isLoading: isActivePlanLoading } = useQuery<
    unknown,
    IErrorObject,
    ISubscriptionData,
    [string, string]
  >(
    [API_KEYS.FETCH_ACTIVE_SUBSCRIPTION, email],
    () => commonApi<ISubscriptionData>(API_KEYS.FETCH_ACTIVE_SUBSCRIPTION as any, {}),
    {
      onSuccess(data) {
        if (data && data.meta) {
          setPlanMeta({
            AUTOMATIC_IMPORTS: data.meta.AUTOMATIC_IMPORTS,
            IMAGE_UPLOAD: data.meta.IMAGE_UPLOAD,
            IMPORTED_ROWS: data.meta.IMPORTED_ROWS,
            REMOVE_BRANDING: data.meta.REMOVE_BRANDING,
            ADVANCED_VALIDATORS: data.meta.ADVANCED_VALIDATORS,
          });
        }
      },
      enabled: !!email,
    }
  );

  return {
    meta,
    activePlanDetails,
    isActivePlanLoading,
  };
}
