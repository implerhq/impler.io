import { useApp } from '@hooks/useApp';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';
import { IErrorObject, SCREENS } from '@impler/shared';
import { handleRouteBasedOnScreenResponse } from '@shared/helpers';

export function useInvitation() {
  const router = useRouter();
  const { profile } = useApp();
  const invitationId = router.query.id as string;

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
      onSuccess: (data) => {
        if (data.email === profile?.email) {
          notify(NOTIFICATION_KEYS.VALID_INVITATION, {
            title: 'Invitation Valid',
            message: 'Invitation is Valid.',
            color: 'red',
          });
        }
      },
      onError: (error: IErrorObject) => {
        notify(NOTIFICATION_KEYS.ERROR_FETCHING_INVITATION, {
          title: 'Error Fetching Invitation',
          message: error?.message || 'Error while fetching invitation details',
          color: 'red',
        });
      },
    }
  );

  const { mutate: acceptInvitationLink, isLoading: isAcceptLoading } = useMutation<any, IErrorObject, void>(
    [API_KEYS.ACCEPT_PROJECT_INVITATION],
    () =>
      commonApi(API_KEYS.ACCEPT_PROJECT_INVITATION as any, {
        query: { invitationId },
      }),
    {
      onSuccess: (data) => {
        notify(NOTIFICATION_KEYS.INVITATION_ACCEPTED, {
          title: 'Invitation Accepted',
          message: `You have successfully joined the Project ${data.projectName}`,
          color: 'green',
        });
        handleRouteBasedOnScreenResponse(data.screen as SCREENS, router.push);
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

  const isLoggedInUser = !!profile;
  const isInvitationValid = !!invitationData;

  return {
    invitationId,
    isInvitationLoading,
    isInvitationError,
    isInvitationValid,
    invitationData,
    isLoggedInUser,
    isAcceptLoading,
    acceptInvitationLink,
  };
}
