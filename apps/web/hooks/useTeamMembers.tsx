import { useState } from 'react';
import { modals } from '@mantine/modals';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { notify } from '@libs/notify';
import { commonApi } from '@libs/api';
import { IErrorObject } from '@impler/shared';
import { useAppState } from 'store/app.context';
import { API_KEYS, NOTIFICATION_KEYS, MODAL_KEYS } from '@config';
import { RemoveTeamMemberModal } from '@components/TeamMembers/RemoveTeamMemberModal';

interface UpdateRoleParams {
  memberId: string;
  role: string;
}

export function useTeamMembers() {
  const { profileInfo } = useAppState();
  const queryClient = useQueryClient();
  const [teamMembersList, setTeamMembersList] = useState<TeamMember[]>([]);

  const { isLoading: isMembersDataLoading } = useQuery<TeamMember[], IErrorObject>(
    [API_KEYS.LIST_TEAM_MEMBERS],
    () => commonApi(API_KEYS.LIST_TEAM_MEMBERS as any, {}),
    {
      onSuccess: (teamMember) => {
        const sortedData = teamMember.sort((a, b) => {
          const aMatches = a._userId.email === profileInfo?.email ? 1 : 0;
          const bMatches = b._userId.email === profileInfo?.email ? 1 : 0;

          return bMatches - aMatches;
        });
        setTeamMembersList(sortedData);
      },
      onError: (error: IErrorObject) => {
        notify(NOTIFICATION_KEYS.ERROR_LISTING_TEAM_MEMBERS, {
          title: 'Error Listing Team Members',
          message: error.message || 'An Error Occurred while listing Team Members',
          color: 'red',
        });
      },
    }
  );

  const { mutate: removeTeamMember, isLoading: isTeamMemberDeleting } = useMutation<IProfileData, IErrorObject, string>(
    (teamMemberId) =>
      commonApi(API_KEYS.DELETE_TEAM_MEMBER as any, {
        parameters: [teamMemberId],
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([API_KEYS.LIST_TEAM_MEMBERS]);
        notify(NOTIFICATION_KEYS.TEAM_MEMBER_DELETED, {
          title: 'Team Member Deleted Successfully',
          message: 'Team Member Deleted Successfully',
          color: 'green',
        });
      },
      onError: (error: IErrorObject) => {
        notify(NOTIFICATION_KEYS.ERROR_DELETING_TEAM_MEMBER, {
          title: 'Error while Deleting Team Member',
          message: error.message || 'An Error Occurred While Deleting Team Member',
          color: 'red',
        });
      },
    }
  );

  const { mutate: updateTeamMemberRole, isLoading: isTeamMemberRoleUpdating } = useMutation<
    IProfileData,
    IErrorObject,
    UpdateRoleParams
  >(
    ({ memberId, role }) =>
      commonApi(API_KEYS.UPDATE_TEAM_MEMBER_ROLE as any, {
        body: { role },
        parameters: [memberId],
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([API_KEYS.LIST_TEAM_MEMBERS]);

        notify(NOTIFICATION_KEYS.TEAM_MEMBER_ROLE_UPDATED, {
          title: 'Role Updated',
          message: 'Team Member Role Updated Successfully',
          color: 'green',
        });
      },
      onError: (error: IErrorObject) => {
        notify(NOTIFICATION_KEYS.ERROR_CHANGING_MEMBER_ROLE, {
          title: 'Error while Changing Team Member Role',
          message: error.message || 'An Error Occurred While Changing Team Member Role',
          color: 'red',
        });
      },
    }
  );

  const openDeleteModal = (userId: string, userName: string) => {
    modals.open({
      title: 'Confirm Team Member Remove',
      id: MODAL_KEYS.CONFIRM_REMOVE_TEAM_MEMBER,
      children: (
        <RemoveTeamMemberModal
          userId={userId}
          userName={userName}
          onDeleteConfirm={() => {
            removeTeamMember(userId);
            modals.closeAll();
          }}
          onCancel={() => modals.closeAll()}
        />
      ),
    });
  };

  return {
    teamMembersList,
    isMembersDataLoading,
    teamMembersCount: teamMembersList.length || 0,
    openDeleteModal,
    isTeamMemberDeleting,
    updateTeamMemberRole,
    isTeamMemberRoleUpdating,
  };
}
