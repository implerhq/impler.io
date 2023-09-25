import jwt from 'jwt-decode';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { track } from '@libs/amplitude';
import { API_KEYS, ROUTES } from '@config';
import { IErrorObject, ILoginResponse } from '@impler/shared';

interface ISignupFormData {
  fullName: string;
  email: string;
  password: string;
}

export function useSignup() {
  const { push } = useRouter();
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignupFormData>();
  const [errorMessage, setErrorMessage] = useState<IErrorObject | undefined>(undefined);
  const { mutate: signup, isLoading: isSignupLoading } = useMutation<
    ILoginResponse,
    IErrorObject,
    ISignupData,
    (string | undefined)[]
  >([API_KEYS.SIGNUP], (body) => commonApi<ILoginResponse>(API_KEYS.SIGNUP as any, { body }), {
    onSuccess: (data) => {
      if (!data) return;
      const profileData = jwt<IProfileData>(data.token as string);
      track({
        name: 'SIGNUP',
        properties: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          id: profileData._id,
        },
      });
      if (data.showAddProject) {
        push(ROUTES.SIGNIN_ONBOARDING);
      } else push(ROUTES.HOME);
    },
    onError(error) {
      if (error.error === 'EmailAlreadyExists') {
        setError('email', {
          type: 'manual',
          message: 'Email already exists',
        });
      } else {
        setErrorMessage(error);
      }
    },
  });

  const onSignup = (data: ISignupFormData) => {
    const signupData: ISignupData = {
      firstName: data.fullName.split(' ')[0],
      lastName: data.fullName.split(' ')[1],
      email: data.email,
      password: data.password,
    };
    signup(signupData);
  };

  return {
    errors,
    register,
    errorMessage,
    isSignupLoading,
    signup: handleSubmit(onSignup),
  };
}
