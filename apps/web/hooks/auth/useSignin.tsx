import jwt from 'jwt-decode';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { track } from '@libs/amplitude';
import { API_KEYS, CONSTANTS, ROUTES } from '@config';
import { IErrorObject, ILoginResponse } from '@impler/shared';

export function useSignin() {
  const { push } = useRouter();
  const { register, handleSubmit } = useForm<ISigninData>();
  const [errorMessage, setErrorMessage] = useState<IErrorObject | undefined>(undefined);
  const { mutate: login, isLoading: isLoginLoading } = useMutation<
    ILoginResponse,
    IErrorObject,
    ISigninData,
    (string | undefined)[]
  >([API_KEYS.SIGNIN], (body) => commonApi<ILoginResponse>(API_KEYS.SIGNIN as any, { body }), {
    onSuccess: (data) => {
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
    onError(error) {
      setErrorMessage(error);
    },
  });

  const onLogin = (data: ISigninData) => {
    login(data);
  };

  return {
    register,
    errorMessage,
    isLoginLoading,
    login: handleSubmit(onLogin),
  };
}
