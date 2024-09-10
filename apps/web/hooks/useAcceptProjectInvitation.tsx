import { useMutation } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';

interface AcceptInvitationParams {
  invitationId: string;
  token: string;
}

export function useAcceptProjectInvitation() {
  const {
    mutate: acceptInvitation,
    isLoading,
    isError,
    error,
    data,
  } = useMutation<any, IErrorObject, AcceptInvitationParams>(
    [API_KEYS.ACCEPT_PROJECT_INVITATION],
    ({ invitationId, token }) =>
      commonApi(API_KEYS.ACCEPT_PROJECT_INVITATION as any, {
        query: {
          invitationId,
          token,
        },
      }),
    {
      onSuccess: () => {},
      onError: () => {},
    }
  );

  return {
    acceptInvitation,
    isLoading,
    isError,
    error,
    data,
  };
}
