import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { useQuery } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { IErrorObject } from '@impler/shared';
import { API_KEYS, MODAL_KEYS } from '@config';

import { ConfirmInvitationModal } from '@components/TeamMembers';

interface IUseAcceptInvitationProps {
  token?: string;
  invitationId?: string;
}

export function useInvitation() {
  const router = useRouter();

  useQuery<
    IUseAcceptInvitationProps,
    IErrorObject,
    { email: string; invitedBy: string; projectName: string },
    string[]
  >(
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
      enabled: !!(router.query.invitationId && router.query.token),
    }
  );

  return {};
}
