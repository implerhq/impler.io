import { useMutation } from '@tanstack/react-query';
import { API_KEYS, CONSTANTS, MODAL_KEYS, NOTIFICATION_KEYS } from '@config';
import { commonApi } from '@libs/api';
import { IErrorObject } from '@impler/shared';
import { notify } from '@libs/notify';
import { deleteCookie, getCookie } from '@shared/utils';
import { modals } from '@mantine/modals';

export function useAcceptInvitation() {
  const { mutate: acceptInvitation, isLoading: isAcceptInvitationLoading } = useMutation<
    any,
    IErrorObject,
    { invitationId: string; token: string }
  >(
    [API_KEYS.ACCEPT_PROJECT_INVITATION],
    ({ invitationId, token }) =>
      commonApi(API_KEYS.ACCEPT_PROJECT_INVITATION as any, {
        query: { invitationId, token },
      }),
    {
      onSuccess: (data) => {
        notify(NOTIFICATION_KEYS.INVITATION_ACCEPTED, {
          title: 'Invitation Accepted',
          message: `You have successfully joined the Project ${data.projectName}`,
          color: 'green',
        });

        deleteCookie(CONSTANTS.INVITATION_URL_COOKIE);

        modals.closeAll();
      },
      onError: () => {
        modals.close(MODAL_KEYS.ACCEPT_INVITATION);
        notify('AN ERROR OCCURED', {
          title: 'Error',
          message: 'An Error occured while accepting invitation',
          color: 'red',
        });
      },
    }
  );

  const acceptInvitationFromCookie = () => {
    const cookie = getCookie(CONSTANTS.INVITATION_URL_COOKIE);

    if (!cookie) {
      modals.close(MODAL_KEYS.ACCEPT_INVITATION);

      return;
    }

    const url = new URL(decodeURIComponent(cookie as string));
    const invitationId = url.searchParams.get('invitationId');
    const token = url.searchParams.get('token');

    if (invitationId && token) {
      acceptInvitation({
        invitationId: invitationId as string,
        token: token as string,
      });
    } else {
      console.error('Invalid invitation data.');
    }
  };

  return {
    acceptInvitationFromCookie,
    isAcceptInvitationLoading,
  };
}
