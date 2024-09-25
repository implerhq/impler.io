import { useEffect, useState } from 'react';
import { useApp } from '@hooks/useApp';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { useLogout } from '@hooks/auth/useLogout';
import { API_KEYS, NOTIFICATION_KEYS, ROUTES } from '@config';
import { IErrorObject, SCREENS } from '@impler/shared';
import { handleRouteBasedOnScreenResponse } from '@shared/helpers';

export enum ModesEnum {
  ACTIVE = 'ACTIVE',
  ACCEPT = 'ACCEPT',
}

export function useInvitation() {
  const { profile } = useApp();
  const { replace, query, push } = useRouter();
  const { logout } = useLogout({
    onLogout: () => replace(ROUTES.SIGNIN),
  });
  const [mode, setMode] = useState<ModesEnum>(ModesEnum.ACTIVE);
  const invitationId = query.id as string;

  const {
    data: invitationData,
    isError: isInvitationError,
    isLoading: isInvitationLoading,
  } = useQuery<any, IErrorObject, { email: string; invitedBy: string; projectName: string }>(
    [API_KEYS.GET_PROJECT_INVITATION, invitationId],
    () =>
      commonApi(API_KEYS.GET_PROJECT_INVITATION as any, {
        parameters: [invitationId],
      }),
    {
      enabled: !!invitationId,
      onError: () => {
        setMode(ModesEnum.ACTIVE);
      },
    }
  );

  const { mutate: acceptInvitation, isLoading: isAcceptInvitationLoading } = useMutation<
    { screen: SCREENS },
    IErrorObject,
    void,
    [string]
  >(
    [API_KEYS.ACCEPT_PROJECT_INVITATION],
    () =>
      commonApi(API_KEYS.ACCEPT_PROJECT_INVITATION as any, {
        query: { invitationId },
      }),
    {
      onSuccess: (data) => {
        handleRouteBasedOnScreenResponse(data.screen as SCREENS, push);
      },
      onError: () => {
        notify(NOTIFICATION_KEYS.ERROR_FETCHING_INVITATION, {
          title: 'Error',
          message: 'An error occurred while accepting the invitation',
          color: 'red',
        });
      },
    }
  );

  useEffect(() => {
    if (profile && invitationData && invitationData.email === profile?.email) {
      setMode(ModesEnum.ACCEPT);
    }
  }, [profile, invitationData]);

  const isLoggedInUser = !!profile;
  const isInvitationValid = !!invitationData;

  return {
    mode,
    logout,
    invitationId,
    isInvitationLoading,
    isInvitationError,
    isInvitationValid,
    invitationData,
    isLoggedInUser,
    acceptInvitation,
    isAcceptInvitationLoading,
  };
}
