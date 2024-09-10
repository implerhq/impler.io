import { useQuery } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';

export function useSentProjectInvitations() {
  const {
    data: invitations,
    refetch: refetchInvitations,
    isLoading: isInvitationsLoading,
    isFetched: isInvitationsFetched,
    isError,
  } = useQuery<SentProjectInvitation[], IErrorObject>(
    [API_KEYS.SENT_PROJECT_INVITATION],
    () => commonApi<SentProjectInvitation[]>(API_KEYS.SENT_PROJECT_INVITATION as any, {}),
    {
      onSuccess() {},
      onError() {},
    }
  );

  return {
    invitations,
    refetchInvitations,
    isInvitationsLoading,
    isInvitationsFetched,
    isError,
    invitationsCount: invitations?.length || 0,
  };
}
