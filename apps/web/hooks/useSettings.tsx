import jwt from 'jwt-decode';
import { useLocalStorage } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { API_KEYS, CONSTANTS } from '@config';
import { IErrorObject } from '@impler/shared';
import { notify } from '@libs/notify';

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
      notify('REGENERATED');
    },
  });

  return {
    regenerateAccessToken,
    isAccessTokenRegenerating,
    accessToken: profile?.accessToken,
  };
}
