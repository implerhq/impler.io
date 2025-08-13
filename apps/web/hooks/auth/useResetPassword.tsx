import jwt from 'jwt-decode';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { API_KEYS, CONSTANTS, ROUTES } from '@config';
import { commonApi } from '@libs/api';
import { IErrorObject, ILoginResponse, SCREENS } from '@impler/shared';
import { track } from '@libs/amplitude';
import { handleRouteBasedOnScreenResponse } from '@shared/helpers';

interface IResetPasswordFormData {
  password: string;
}

interface IResetPasswordData extends IResetPasswordFormData {
  token: string;
}

export function useResetPassword() {
  const { push, query } = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }, } = useForm<IResetPasswordFormData>();
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
        const profileData = jwt<IProfileData>(data.token as string);
        track({
          name: 'SIGNIN',
          properties: {
            email: profileData.email,
            id: profileData._id,
          },
        });
        handleRouteBasedOnScreenResponse(data.screen as SCREENS, push);
      },
    }
  );

  const goToLogin = () => {
    push(ROUTES.SIGNIN);
  };

  const onResetPassword = (data: IResetPasswordFormData) => {
    if (data.password && data.password.length > CONSTANTS.MAX_PASSWORD_LENGTH) {
      setError("password", {
        type: "manual",
        message: `Password length must be less than ${CONSTANTS.MAX_PASSWORD_LENGTH}!`
      });
    }
    resetPassword({
      ...data,
      token: query.token as string,
    });
  };

  return {
    error,
    errors,
    isError,
    register,
    goToLogin,
    isResetPasswordLoading,
    resetPassword: handleSubmit(onResetPassword),
  };
}
