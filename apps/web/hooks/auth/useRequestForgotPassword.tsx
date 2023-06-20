import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { API_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { IErrorObject } from '@impler/shared';
import { useRouter } from 'next/router';

interface IRequestForgotPasswordData {
  email: string;
}

interface IRequestForgotPasswordResponse {
  success: boolean;
}

export function useRequestForgotPassword() {
  const { push } = useRouter();
  const { register, handleSubmit } = useForm<IRequestForgotPasswordData>();
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const { mutate: requestForgotPassword, isLoading: isForgotPasswordRequesting } = useMutation<
    IRequestForgotPasswordResponse,
    IErrorObject,
    IRequestForgotPasswordData,
    (string | undefined)[]
  >(
    [API_KEYS.REQUEST_FORGOT_PASSWORD],
    (body) => commonApi<IRequestForgotPasswordResponse>(API_KEYS.REQUEST_FORGOT_PASSWORD as any, { body }),
    {
      onSuccess: (data) => {
        if (!data) return;
        if (data.success) setRequestSent(true);
      },
    }
  );

  const goToLogin = () => {
    push('/signin');
  };

  const onLogin = (data: IRequestForgotPasswordData) => {
    requestForgotPassword(data);
  };

  return {
    register,
    goToLogin,
    requestSent,
    isForgotPasswordRequesting,
    request: handleSubmit(onLogin),
  };
}
