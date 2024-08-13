import jwt from 'jwt-decode';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { API_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { track } from '@libs/amplitude';
import { useAppState } from 'store/app.context';
import { handleRouteBasedOnScreenResponse } from '@shared/helpers';
import { IErrorObject, ILoginResponse, SCREENS } from '@impler/shared';

interface ISignupFormData {
  fullName: string;
  email: string;
  password: string;
}

export function useSignup() {
  const { setProfileInfo } = useAppState();
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
      setProfileInfo(profileData);
      track({
        name: 'SIGNUP',
        properties: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          id: profileData._id,
        },
      });
      handleRouteBasedOnScreenResponse(data.screen as SCREENS, push);
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
