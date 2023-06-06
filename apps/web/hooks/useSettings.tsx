import jwt from 'jwt-decode';
import { useLocalStorage } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { API_KEYS, CONSTANTS } from '@config';
import { IErrorObject } from '@impler/shared';

interface RegenerateData {
  token: string;
}

export function useSettings() {
  const [profile, setProfile] = useLocalStorage<IProfileData>({ key: CONSTANTS.PROFILE_STORAGE_NAME });
  const { mutate: regenerateAccessToken, isLoading: isAccessTokenRegenerating } = useMutation<
    RegenerateData,
    IErrorObject,
    void,
    unknown
  >([API_KEYS.REGENERATE], () => commonApi<RegenerateData>('REGENERATE', {}), {
    onSuccess: (data) => {
      setProfile(jwt(data.token));
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
    accessToken: profile?.accessToken,
  };
}
