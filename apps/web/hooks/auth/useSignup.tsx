import jwt from 'jwt-decode';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';

import { notify } from '@libs/notify';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';
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

interface ISignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function useSignup() {
  const { setProfileInfo } = useAppState();
  const { push, query } = useRouter();
  const {
    setValue,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignupFormData>({});
  const [errorMessage, setErrorMessage] = useState<IErrorObject | undefined>(undefined);

  const { invitationId, token } = query as { invitationId?: string; token?: string };
  const isInvitationLink = !!invitationId && !!token;

  const { isLoading: isAcceptingInvitation, isError } = useQuery<any, IErrorObject, { email: string }>(
    [API_KEYS.ACCEPT_PROJECT_INVITATION, invitationId, token],
    () =>
      commonApi(API_KEYS.ACCEPT_PROJECT_INVITATION as any, {
        query: {
          invitationId,
          token,
        },
      }),
    {
      enabled: isInvitationLink,
      onSuccess: (data) => {
        setValue('email', data.email);
      },
      onError: (error) => {
        notify(NOTIFICATION_KEYS.ERROR_ACCEPTING_INVITATION, {
          title: 'Error Accepting Invitation',
          message: error?.message || 'Error while accepting invitation',
          color: 'red',
        });
      },
    }
  );

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
        track({ name: 'SIGNUP DUPLICATE EMAIL', properties: {} });
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
    isAcceptingInvitation,
    isError,
    isInvitationLink,
    signup: handleSubmit(onSignup),
  };
}
