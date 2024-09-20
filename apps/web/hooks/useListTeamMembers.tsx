import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_KEYS, NOTIFICATION_KEYS, MODAL_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';
import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { useAppState } from 'store/app.context';
import { modals } from '@mantine/modals';
import { DeleteTeamMemberModal } from '@components/TeamMembers/DeleteTeamMemberModal';

interface DeleteMemberParams {
  userId: string;
  projectId: string;
}

interface UpdateRoleParams {
  projectId: string;
  userId: string;
  role: string;
}

export function useListTeamMembers() {
  const { profileInfo } = useAppState();
  const queryClient = useQueryClient();
  const [teamMembersList, setTeamMembersList] = useState<TeamMemberList[]>([]);

  const { isLoading: isMembersDataLoading } = useQuery<TeamMemberList[], IErrorObject>(
    [API_KEYS.LIST_TEAM_MEMBERS],
    () => commonApi(API_KEYS.LIST_TEAM_MEMBERS as any, {}),
    {
      onSuccess: (teamMember) => {
        const transformedData = teamMember.flatMap((member: any) =>
          member.apiKeys.map((apiKey: any) => ({
            _id: apiKey._userId._id,
            user: {
              name: `${apiKey._userId.firstName} ${apiKey._userId.lastName}`,
              email: apiKey._userId.email,
            },
            joinedDate: apiKey.joinedOn,
            role: apiKey.role,
            projectId: member._projectId,
            isCurrentUser: apiKey._userId.email === profileInfo?.email,
          }))
        );
        const sortedData = transformedData.sort((a, b) => b.isCurrentUser - a.isCurrentUser);
        setTeamMembersList(sortedData);
      },
      onError: (error: IErrorObject) => {
        notify(NOTIFICATION_KEYS.ERROR_LISTING_TEAM_MEMBERS, {
          title: 'Error Listing Team Members',
          message: error.message || 'An Error Occured while listing Team Members',
          color: 'red',
        });
      },
    }
  );

  const { mutate: deleteMember, isLoading: isMemberDeleting } = useMutation<any, IErrorObject, DeleteMemberParams>(
    ({ projectId, userId }) =>
      commonApi(API_KEYS.DELETE_TEAM_MEMBER as any, {
        query: { projectId, userId },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([API_KEYS.LIST_TEAM_MEMBERS]);
        notify(NOTIFICATION_KEYS.TEAM_MEMBER_DELETED, {
          title: 'Team Member Deleted Successfuly',
          message: 'Team Member Deleted Successfuly',
          color: 'green',
        });
      },
      onError: (error: IErrorObject) => {
        notify(NOTIFICATION_KEYS.ERROR_DELETING_TEAM_MEMBER, {
          title: 'Error while Deleting TeamMember',
          message: error.message || 'An Error Occured While Deleting TeamMember',
          color: 'green',
        });
      },
    }
  );

  const { mutate: updateTeamMemberRole, isLoading: isTeamMemberRoleUpdating } = useMutation<
    any,
    IErrorObject,
    UpdateRoleParams
  >(
    ({ projectId, userId, role }) =>
      commonApi(API_KEYS.UPDATE_TEAM_MEMBER_ROLE as any, {
        body: { projectId, userId, role },
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
          message: error.message || 'An Error Occured While Changing TeamMember Role',
          color: 'red',
        });
      },
    }
  );

  const openDeleteModal = (projectId: string, userId: string, userName: string) => {
    modals.open({
      title: 'Confirm Team Member Deletion',
      id: MODAL_KEYS.CONFIRM_DELETE_TEAM_MEMBER,
      children: (
        <DeleteTeamMemberModal
          projectId={projectId}
          userId={userId}
          userName={userName}
          onDeleteConfirm={() => {
            deleteMember({ projectId, userId });
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
    isMemberDeleting,
    updateTeamMemberRole,
    isTeamMemberRoleUpdating,
  };
}
