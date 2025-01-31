/* eslint-disable multiline-comment-style */
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { commonApi } from '@libs/api';
import { track } from '@libs/amplitude';
import { getCookie } from '@shared/utils';
import { useAppState } from 'store/app.context';
import { API_KEYS, CONSTANTS, ROUTES } from '@config';
import { IErrorObject, IEnvironmentData, IProjectPayload } from '@impler/shared';
import { UseFormSetError } from 'react-hook-form';
interface UseOnboardUserProjectFormProps {
  setError?: UseFormSetError<CreateOnboardImportFormData>;
}

export function useOnboardUserProjectForm({ setError }: UseOnboardUserProjectFormProps) {
  const { push, replace } = useRouter();
  const { profileInfo, setProfileInfo } = useAppState();

  const { mutate: onboardUser, isLoading: isUserOnboardLoading } = useMutation<
    { onboard: IOnboardUserData; environment: IEnvironmentData; p: IProjectPayload },
    IErrorObject,
    ProjectOnboardFormData,
    string[]
  >(
    [API_KEYS.ONBOARD_USER],
    (apiData) => commonApi(API_KEYS.ONBOARD_USER as any, { body: { ...apiData, onboarding: true } }),
    {
      onSuccess: (onboardResponseData, onboardData) => {
        if (profileInfo) {
          setProfileInfo({
            ...profileInfo,
            _projectId: onboardResponseData.environment._projectId,
            accessToken: onboardResponseData.environment.key,
          });
        }
        track({
          name: 'PROJECT CREATE',
          properties: { duringOnboard: true },
        });

        track({
          name: 'ONBOARD',
          properties: {
            companySize: onboardData.companySize,
            role: onboardData.role,
            source: onboardData.source,
          },
        });
        const redirectUrl = getCookie(CONSTANTS.INVITATION_URL_COOKIE);
        if (redirectUrl) {
          push(ROUTES.TEAM_MEMBERS);
        } else {
          replace(ROUTES.ONBOARD_TEMPLATE);

          return;
        }
      },
      onError: (error: IErrorObject) => {
        if (setError) {
          setError('file', {
            message: error.message,
            type: 'manual',
          });
        }
      },
    }
  );

  return {
    onboardUser,
    isUserOnboardLoading,
  };
}
