import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS } from '@config';
import { IErrorObject, IEnvironmentData } from '@impler/shared';

export function useOnboardUserProjectForm() {
  const { push } = useRouter();

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
        push('/');
      },
    }
  );

  return { onboardUser, isUserOnboardLoading };
}
