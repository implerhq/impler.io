import { useMutation } from '@tanstack/react-query';

import { API_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { IErrorObject } from '@impler/shared';
import { useAppState } from 'store/app.context';

interface RegenerateData {
  accessToken: string;
}

export function useSettings() {
  const { profileInfo, setProfileInfo } = useAppState();
  const { mutate: regenerateAccessToken, isLoading: isAccessTokenRegenerating } = useMutation<
    RegenerateData,
    IErrorObject,
    void,
    (string | undefined)[]
  >([API_KEYS.REGENERATE, profileInfo?._projectId], () => commonApi<RegenerateData>('REGENERATE', {}), {
    onSuccess: (data) => {
      track({
        name: 'REGENERATE TOKEN',
        properties: {},
      });
      notify('REGENERATED');
      if (profileInfo) {
        setProfileInfo({
          ...profileInfo,
          accessToken: data.accessToken,
        });
      }
    },
  });

  return {
    regenerateAccessToken,
    isAccessTokenRegenerating,
    accessToken: profileInfo?.accessToken,
  };
}
