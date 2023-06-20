import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { API_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { IErrorObject, ILoginResponse } from '@impler/shared';

export function useSignin() {
  const { push } = useRouter();
  const { register, handleSubmit } = useForm<ILoginData>();
  const [errorMessage, setErrorMessage] = useState<IErrorObject | undefined>(undefined);
  const { mutate: login, isLoading: isLoginLoading } = useMutation<
    ILoginResponse,
    IErrorObject,
    ILoginData,
    (string | undefined)[]
  >([API_KEYS.SIGNIN], (body) => commonApi<ILoginResponse>(API_KEYS.SIGNIN as any, { body }), {
    onSuccess: (data) => {
      if (!data) return;
      const { token, showAddProject } = data;
      push('/signin', {
        query: `?token=${token}&showAddProject=${showAddProject}`,
      });
    },
    onError(error) {
      setErrorMessage(error);
    },
  });

  const onLogin = (data: ILoginData) => {
    login(data);
  };

  return {
    register,
    errorMessage,
    isLoginLoading,
    login: handleSubmit(onLogin),
  };
}
