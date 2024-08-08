import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';

import { API_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { track } from '@libs/amplitude';
import { useAppState } from 'store/app.context';
import { IErrorObject, IEnvironmentData } from '@impler/shared';

export function useOnboardUserProjectForm() {
  const { push } = useRouter();
  const { profileInfo, setProfileInfo } = useAppState();

  const { mutate: onboardUser, isLoading: isUserOnboardLoading } = useMutation<
    { onboard: IOnboardUserData; environment: IEnvironmentData },
    IErrorObject,
    IOnboardUserData,
    string[]
  >(
    [API_KEYS.ONBOARD_USER],
    (apiData) => commonApi(API_KEYS.ONBOARD_USER as any, { body: { ...apiData, onboarding: true } }),
    {
      onSuccess: () => {
        if (profileInfo) {
          setProfileInfo({
            ...profileInfo,
            _projectId: profileInfo._projectId,
          });
        }
        track({
          name: 'PROJECT CREATE',
          properties: {
            duringOnboard: true,
          },
        });
        push('/');
      },
    }
  );

  return { onboardUser, isUserOnboardLoading };
}
