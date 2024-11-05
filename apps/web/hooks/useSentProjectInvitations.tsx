import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';
import { useClipboard } from '@mantine/hooks';
import { notify } from '@libs/notify';
import { ConfirmDeleteInvitation } from '@components/TeamMembers/ConfirmDeleteInvitation';
import { modals } from '@mantine/modals';

export function useSentProjectInvitations() {
  const queryClient = useQueryClient();
  const clipboard = useClipboard({ timeout: 1000 });

  const {
    data: invitations,
    refetch: refetchInvitations,
    isLoading: isInvitationsLoading,
  } = useQuery<SentProjectInvitation[], IErrorObject>([API_KEYS.SENT_TEAM_INVITATIONS], () =>
    commonApi<SentProjectInvitation[]>(API_KEYS.SENT_TEAM_INVITATIONS as any, {})
  );
  const { mutate: cancelInvitation, isLoading: isCancelInvitationLoading } = useMutation<any, IErrorObject, string>(
    (invitationId) =>
      commonApi(API_KEYS.REVOKE_INVITATION as any, {
        parameters: [invitationId],
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([API_KEYS.SENT_TEAM_INVITATIONS]);
        notify(NOTIFICATION_KEYS.INVITATION_DELETED, {
          title: 'Invitation Cancelled',
          message: `Invitation Cancelled Successfully`,
          color: 'green',
        });
      },
      onError: (error: IErrorObject) => {
        notify(NOTIFICATION_KEYS.ERROR_DELETING_INVITATION, {
          title: 'Error while Deleting Invitation',
          message: error.message || 'An Error Occured While Deleting Invitation',
          color: 'red',
        });
      },
    }
  );

  function handleCopyInvitationLink(invitationId: string) {
    const sentInvitations = invitations?.find((invitation) => invitation._id === invitationId);
    if (sentInvitations?._id === invitationId) {
      clipboard.copy(sentInvitations.invitationLink);
    }
    notify(NOTIFICATION_KEYS.INVITATION_LINK_COPIED, {
      title: 'Invitation Link Copied!',
      message: 'Invitation Link Copied',
      color: 'green',
    });
  }

  function handleCancelInvitation(invitationId: string) {
    const sentInvitation = invitations?.find((invitation) => invitation._id === invitationId);

    if (sentInvitation) {
      modals.open({
        title: 'Confirm Invitation Cancellation',
        children: (
          <ConfirmDeleteInvitation
            onDeleteConfirm={() => {
              cancelInvitation(invitationId);
              modals.closeAll();
            }}
            onCancel={() => modals.closeAll()}
          />
        ),
      });
    }
  }

  return {
    invitations,
    refetchInvitations,
    isInvitationsLoading,
    invitationsCount: invitations?.length || 0,
    handleCopyInvitationLink,
    handleCancelInvitation,
    cancelInvitation,
    isCancelInvitationLoading,
  };
}
