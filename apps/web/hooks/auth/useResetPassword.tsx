import jwt from 'jwt-decode';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { API_KEYS, CONSTANTS, ROUTES } from '@config';
import { commonApi } from '@libs/api';
import { IErrorObject, ILoginResponse } from '@impler/shared';
import { track } from '@libs/amplitude';

interface IResetPasswordFormData {
  password: string;
}

interface IResetPasswordData extends IResetPasswordFormData {
  token: string;
}

export function useResetPassword() {
  const { push, query } = useRouter();
  const { register, handleSubmit } = useForm<IResetPasswordFormData>();
  const {
    mutate: resetPassword,
    isLoading: isResetPasswordLoading,
    error,
    isError,
  } = useMutation<ILoginResponse, IErrorObject, IResetPasswordData, (string | undefined)[]>(
    [API_KEYS.RESET_PASSWORD],
    (body) => commonApi<ILoginResponse>(API_KEYS.RESET_PASSWORD as any, { body }),
    {
      onSuccess: (data) => {
        if (!data) return;
        if (!data) return;
        const profileData = jwt<IProfileData>(data.token as string);
        localStorage.setItem(CONSTANTS.PROFILE_STORAGE_NAME, JSON.stringify(profileData));
        track({
          name: 'SIGNIN',
          properties: {
            email: profileData.email,
            id: profileData._id,
          },
        });
        if (data.showAddProject) {
          push(ROUTES.SIGNIN_ONBOARDING);
        } else push(ROUTES.HOME);
      },
    }
  );

  const goToLogin = () => {
    push(ROUTES.SIGNIN);
  };

  const onResetPassword = (data: IResetPasswordFormData) => {
    resetPassword({
      ...data,
      token: query.token as string,
    });
  };

  return {
    error,
    isError,
    register,
    goToLogin,
    isResetPasswordLoading,
    resetPassword: handleSubmit(onResetPassword),
  };
}
