import { useQuery } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';

interface AcceptInvitationParams {
  invitationId: string;
  token: string;
}

export function useAcceptProjectInvitation({ invitationId, token }: AcceptInvitationParams) {
  const {
    data: invitationEmail,
    isLoading,
    isError,
    error,
  } = useQuery<any, IErrorObject, AcceptInvitationParams>(
    [API_KEYS.ACCEPT_PROJECT_INVITATION, invitationId, token],
    () =>
      commonApi(API_KEYS.ACCEPT_PROJECT_INVITATION as any, {
        query: {
          invitationId,
          token,
        },
      }),
    {
      enabled: !!invitationId && !!token,
      onSuccess: (data) => {
        console.log('Accepted Invitation:', data);
      },
      onError: (err) => {
        console.error('Error accepting invitation:', err);
      },
    }
  );

  return {
    invitationEmail,
    isLoading,
    isError,
    error,
  };
}
