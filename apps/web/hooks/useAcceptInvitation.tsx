import { modals } from '@mantine/modals';
import { useMutation } from '@tanstack/react-query';

import { notify } from '@libs/notify';
import { commonApi } from '@libs/api';
import { IErrorObject } from '@impler/shared';
import { API_KEYS, MODAL_KEYS, NOTIFICATION_KEYS } from '@config';

interface IUseAcceptInvitationProps {
  invitationId: string;
  token: string;
}

export function useAcceptInvitation({ invitationId, token }: IUseAcceptInvitationProps) {
  const { mutate: onAcceptClick, isLoading: isAcceptLoading } = useMutation<any, IErrorObject, void>(
    [API_KEYS.ACCEPT_TEAM_INVITATION],
    () =>
      commonApi(API_KEYS.ACCEPT_TEAM_INVITATION as any, {
        query: { invitationId, token },
      }),
    {
      onSuccess: (data) => {
        notify(NOTIFICATION_KEYS.INVITATION_ACCEPTED, {
          title: 'Invitation Accepted',
          message: `You have successfully joined the Project ${data.projectName}`,
          color: 'green',
        });
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

  return {
    onAcceptClick,
    isAcceptLoading,
  };
}
