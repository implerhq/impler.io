import { useMutation } from '@tanstack/react-query';

import { API_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { IErrorObject } from '@impler/shared';
import { useAppState } from 'store/app.context';

interface RegenerateData {
  token: string;
}

export function useSettings() {
  const { profileInfo } = useAppState();
  const { mutate: regenerateAccessToken, isLoading: isAccessTokenRegenerating } = useMutation<
    RegenerateData,
    IErrorObject,
    void,
    unknown
  >([API_KEYS.REGENERATE], () => commonApi<RegenerateData>('REGENERATE', {}), {
    onSuccess: (data) => {
      console.log(data);
      track({
        name: 'REGENERATE TOKEN',
        properties: {},
      });
      notify('REGENERATED');
    },
  });

  return {
    regenerateAccessToken,
    isAccessTokenRegenerating,
    accessToken: profileInfo?.accessToken,
  };
}
