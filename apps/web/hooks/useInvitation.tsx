import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { API_KEYS, MODAL_KEYS, NOTIFICATION_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';
import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { modals } from '@mantine/modals';
import { ConfirmInvitationModal } from '@components/TeamMembers';

export function useInvitation() {
  const router = useRouter();

  useQuery<any, IErrorObject, { email: string; invitedBy: string; projectName: string }, string[]>(
    [API_KEYS.GET_PROJECT_INVITATION],
    () =>
      commonApi(API_KEYS.GET_PROJECT_INVITATION as any, {
        query: { invitationId: router.query.invitationId as string, token: router.query.token as string },
      }),
    {
      onSuccess(data) {
        modals.open({
          title: 'Accept Invitation',
          id: MODAL_KEYS.ACCEPT_INVITATION,
          modalId: MODAL_KEYS.ACCEPT_INVITATION,
          children: (
            <ConfirmInvitationModal
              invitationId={router.query.invitationId as string}
              token={router.query.token as string}
              invitedBy={data.invitedBy}
              projectName={data.projectName}
            />
          ),
        });
      },
      onError: (error: IErrorObject) => {
        notify(NOTIFICATION_KEYS.ERROR_ACCEPTING_INVITATION, {
          title: 'Error Accepting Invitation',
          message: error?.message || 'Error while accepting invitation',
          color: 'red',
        });
      },
      enabled: !!(router.query.invitationId && router.query.token),
    }
  );

  return {};
}
