import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { useAppState } from 'store/app.context';
import { IErrorObject } from '@impler/shared';

export function useAllowedDomains() {
  const queryClient = useQueryClient();
  const { profileInfo } = useAppState();

  const { data: allowedDomains, isLoading: isAllowedDomainsLoading } = useQuery<
    string[],
    IErrorObject,
    string[],
    (string | undefined)[]
  >(
    [API_KEYS.PROJECT_ALLOWED_DOMAINS_GET, profileInfo?._projectId],
    () => commonApi<string[]>('PROJECT_ALLOWED_DOMAINS_GET', { parameters: [profileInfo?._projectId || ''] }),
    {
      enabled: !!profileInfo?._projectId,
    }
  );

  const { mutate: updateAllowedDomains, isLoading: isAllowedDomainsUpdating } = useMutation<
    string[],
    IErrorObject,
    { allowedDomains: string[] },
    unknown
  >(
    [API_KEYS.PROJECT_ALLOWED_DOMAINS_UPDATE, profileInfo?._projectId],
    (data) =>
      commonApi<string[]>('PROJECT_ALLOWED_DOMAINS_UPDATE', {
        parameters: [profileInfo?._projectId || ''],
        body: data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([API_KEYS.PROJECT_ALLOWED_DOMAINS_GET, profileInfo?._projectId]);
        notify(NOTIFICATION_KEYS.ALLOWED_DOMAINS_UPDATED);
      },
      onError: (error: IErrorObject) => {
        notify(NOTIFICATION_KEYS.ERROR_OCCURED, {
          title: 'Update failed',
          message: error.message || 'An error occurred while updating allowed domains.',
        });
      },
    }
  );

  return {
    allowedDomains: allowedDomains || [],
    isAllowedDomainsLoading,
    updateAllowedDomains,
    isAllowedDomainsUpdating,
  };
}
